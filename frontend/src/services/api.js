import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { CircularProgress, Backdrop, Alert, Snackbar, Button } from '@mui/material';

// Configurações da API
const API_CONFIG = {
  EXTERNAL: {
    BASE_URL: "https://cmarqx.sigavi360.com.br",
    AUTH_ENDPOINT: "/Sigavi/api/Acesso/Token",
    ENDPOINTS: {
      BUSCA_EMPREENDIMENTO: "/Sigavi/Api/Site/BuscaEmpreendimento",
      BUSCA_IMOVEIS: "/Sigavi/Api/Site/Busca",
      BUSCA_CORRETORES: "/TH/Api/Autonomo/Busca"
    }
  },
  INTERNAL: {
    BASE_URL: "http://127.0.0.1:8000",
    ENDPOINTS: {
      IMOVEIS: "/api/imoveis/",
      LOGO: "/api/logo/",
      ABOUTS: "/api/abouts/",
      CONTACT: "/api/contact/",
      NEWSLETTER: "/api/newsletter/",
      CALL_REQUEST: "/api/call-request/",
      AGENDAMENTOS: "/api/agendamentos/",
      BANNERS: "/api/banners/"
    },
    METHODS: {
      IMOVEIS: 'GET',
      LOGO: 'GET',
      ABOUTS: 'GET',
      CONTACT: 'POST',
      NEWSLETTER: 'POST',
      CALL_REQUEST: 'POST',
      AGENDAMENTOS: 'POST',
      BANNERS: 'GET'
    },
    CONTENT_TYPES: {
      NEWSLETTER: 'application/json',
      CALL_REQUEST: 'application/json',
      AGENDAMENTOS: 'application/json',
      CONTACT: 'application/json',
    }
  }
};

const CACHE_CONFIG = {
  PREFIX: 'sigavi_cache_',
  TTL: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  ENABLED: true
};

const SigaviApiContext = createContext();

// Helper function moved outside the component
const getTipoOperacaoFromValorTipoExibicao = (valorTipoExibicao, valorVenda, valorLocacao) => {
  if (!valorTipoExibicao) return "Venda"; // Default
  
  // Handle numeric values (1, 2, 3)
  if (typeof valorTipoExibicao === 'number') {
    switch(valorTipoExibicao) {
      case 1: return "Venda";
      case 2: return "Locação";
      case 3: return valorVenda > 0 ? "Venda" : "Locação";
      default: return "Venda";
    }
  }
  
  // Handle string values
  if (typeof valorTipoExibicao === 'string') {
    const normalized = valorTipoExibicao.toLowerCase().trim();
    
    if (normalized.includes('somente locação') || normalized.includes('somente locacao')) {
      return "Locação";
    }
    
    if (normalized.includes('venda e locação') || normalized.includes('venda e locacao')) {
      return valorVenda > 0 ? "Venda" : "Locação";
    }
    
    if (normalized.includes('venda')) {
      return "Venda";
    }
  }
  
  return "Venda"; // Default fallback
};

export const SigaviApiProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cache methods
  const getCacheKey = (endpointKey, params = {}) => {
    return `${CACHE_CONFIG.PREFIX}${endpointKey}_${JSON.stringify(params)}`;
  };

  const getFromCache = (cacheKey) => {
    if (!CACHE_CONFIG.ENABLED) return null;
    
    const cachedData = localStorage.getItem(cacheKey);
    if (!cachedData) return null;

    const { data, timestamp } = JSON.parse(cachedData);
    
    if (Date.now() - timestamp > CACHE_CONFIG.TTL) {
      localStorage.removeItem(cacheKey);
      return null;
    }

    return data;
  };

  const setToCache = (cacheKey, data) => {
    if (!CACHE_CONFIG.ENABLED) return;
    
    const cacheData = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
  };

  // Autenticação
  const authenticate = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('username', 'integracao');
      params.append('password', 'HScNneuN6PKxDq0');
      params.append('grant_type', 'password');

      const response = await axios.post(
        `${API_CONFIG.EXTERNAL.BASE_URL}${API_CONFIG.EXTERNAL.AUTH_ENDPOINT}`,
        params,
        {
          headers: { 
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
          }
        }
      );

      setToken(response.data.access_token);
      localStorage.setItem('sigavi_token', response.data.access_token);
      localStorage.setItem('sigavi_token_expiry', Date.now() + 24 * 60 * 60 * 1000);
      return response.data.access_token;
    } catch (err) {
      console.error('Authentication error:', err);
      setError(err.response?.data?.error_description || 'Falha na autenticação');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const apiRequest = useCallback(async (endpointKey, params = {}, config = {}, forceRefresh = false) => {
    const cacheKey = getCacheKey(endpointKey, params);
    
    if (!forceRefresh && config.method !== 'POST') {
      const cachedData = getFromCache(cacheKey);
      if (cachedData) {
        return cachedData;
      }
    }
  
    setLoading(true);
    try {
      const isInternal = Object.keys(API_CONFIG.INTERNAL.ENDPOINTS).includes(endpointKey);
      const endpointGroup = isInternal ? API_CONFIG.INTERNAL : API_CONFIG.EXTERNAL;
      
      let endpoint = endpointGroup.ENDPOINTS[endpointKey];
      
      if (!isInternal) {
        const currentToken = token || await authenticate();
        if (!currentToken) throw new Error('Falha na autenticação');
  
        const response = await axios.post(
          `${endpointGroup.BASE_URL}${endpoint}`,
          params,
          {
            headers: {
              'Authorization': `Bearer ${currentToken}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Origin': window.location.origin,
              'Access-Control-Request-Method': 'POST'
            },
            timeout: 10000
          }
        );
        
        if (response.status >= 200 && response.status < 300) {
          setToCache(cacheKey, response.data);
          return response.data;
        }
        
        throw new Error(`Resposta inválida: ${response.status}`);
      }
  
      // Tratamento para endpoints internos
      const method = API_CONFIG.INTERNAL.METHODS[endpointKey] || 'GET';
      const contentType = API_CONFIG.INTERNAL.CONTENT_TYPES[endpointKey] || 'application/json';
      
      const response = await axios({
        method,
        url: `${endpointGroup.BASE_URL}${endpoint}`,
        data: method !== 'GET' ? params : undefined,
        params: method === 'GET' ? params : undefined,
        headers: {
          'Content-Type': contentType,
          ...config.headers
        }
      });
      
      if (response.status >= 200 && response.status < 300) {
        setToCache(cacheKey, response.data);
        return response.data;
      }
      
      throw new Error(`Resposta inválida: ${response.status}`);
    } catch (err) {
      console.error(`Error in ${endpointKey}:`, err);
      
      const cachedData = getFromCache(cacheKey);
      if (cachedData && config.method !== 'POST') {
        console.warn(`Using cached data for ${endpointKey} due to API error`);
        return cachedData;
      }
      
      if (Object.keys(API_CONFIG.INTERNAL.ENDPOINTS).includes(endpointKey)) {
        console.warn(`Failed to load ${endpointKey}, returning empty array`);
        return [];
      }
      
      if (err.response?.status === 500) {
        setError('Erro temporário no servidor. Tente novamente mais tarde.');
        throw new Error('Erro temporário no servidor');
      }
      
      const errorMsg = err.response?.data?.message || err.message || 'Erro no servidor';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [token, authenticate]);

  // Memoized normalization functions
  const normalizeImovel = useCallback((imovel) => {
    if (!imovel) return null;
    
    const tipoOperacao = getTipoOperacaoFromValorTipoExibicao(
      imovel.ValorTipoExibicao,
      imovel.ValorVenda,
      imovel.ValorLocacao
    );
    
    return {
      id: imovel.Id || imovel.id || "",
      Tipo: imovel.Tipo || "Imóvel",
      Titulo: imovel.Titulo || imovel.Referencia || "Imóvel sem título",
      Descricao: imovel.Descricao || "",
      ValorVenda: imovel.ValorVenda || imovel.Valor || 0,
      ValorLocacao: imovel.ValorLocacao || 0,
      Dormitorios: imovel.Dormitorio || imovel.Dormitorios || 0,
      Suites: imovel.Suite || imovel.Suites || 0,
      Banheiros: imovel.WC || imovel.Banheiros || 0,
      Vagas: imovel.Vaga || imovel.Vagas || 0,
      AreaTotal: imovel.AreaTotal || imovel.Area || 0,
      Bairro: imovel.Bairro || "",
      Cidade: imovel.Cidade || "",
      Fotos: imovel.Fotos?.map(f => ({ Url: f.Url, Descricao: f.Descricao || "" })) || [],
      Finalidade: imovel.Finalidade || "",
      Status: imovel.Disponibilidade || imovel.Status || "Disponível",
      TipoOperacao: tipoOperacao,
      ValorTipoExibicao: imovel.ValorTipoExibicao || "Publicar venda",
      isLancamento: false,
      Destaque: imovel.Destaque || false,
      rawData: imovel
    };
  }, []);

  const normalizeLancamento = useCallback((lancamento) => {
    if (!lancamento) return null;
    
    const primeiraTipologia = lancamento.Tipologias?.[0] || {};
    const valorVenda = primeiraTipologia.Valor || lancamento.Valor || 0;
    
    const tipoOperacao = getTipoOperacaoFromValorTipoExibicao(
      lancamento.ValorTipoExibicao,
      valorVenda,
      lancamento.ValorLocacao
    );
    
    return {
      id: lancamento.Id || lancamento.id || "",
      Tipo: lancamento.Tipo || "Empreendimento",
      Titulo: lancamento.Nome || lancamento.Titulo || "Empreendimento sem título",
      Descricao: lancamento.Descricao || "",
      ValorVenda: valorVenda,
      ValorLocacao: lancamento.ValorLocacao || 0,
      Dormitorios: primeiraTipologia.Dormitorios || lancamento.Dormitorios || 0,
      Suites: primeiraTipologia.Suites || lancamento.Suites || 0,
      Banheiros: primeiraTipologia.WC || lancamento.Banheiros || 0,
      Vagas: primeiraTipologia.Vagas || lancamento.Vagas || 0,
      AreaTotal: primeiraTipologia.AreaTotal || lancamento.Area || 0,
      Bairro: lancamento.Bairro || "",
      Cidade: lancamento.Cidade || "",
      Fotos: lancamento.Fotos?.map(f => ({ Url: f.Url, Descricao: f.Descricao || "" })) || [],
      Finalidade: lancamento.Finalidade || "",
      Status: lancamento.Fase || lancamento.Status || "Em construção",
      TipoOperacao: tipoOperacao,
      ValorTipoExibicao: lancamento.ValorTipoExibicao || "Publicar venda",
      isLancamento: true,
      Destaque: lancamento.Destaque || false,
      Caracteristicas: lancamento.Caracteristicas || [],
      Plantas: lancamento.Plantas || [],
      Tipologias: lancamento.Tipologias || [],
      rawData: lancamento
    };
  }, []);

  // API methods with proper dependencies
  const fetchImoveis = useCallback(async (forceRefresh = false) => {
    const data = await apiRequest('BUSCA_IMOVEIS', {}, {}, forceRefresh);
    return Array.isArray(data) ? data.map(normalizeImovel).filter(Boolean) : [];
  }, [apiRequest, normalizeImovel]);

  const fetchLancamentos = useCallback(async (forceRefresh = false) => {
    const data = await apiRequest('BUSCA_EMPREENDIMENTO', {}, {}, forceRefresh);
    return Array.isArray(data) ? data.map(normalizeLancamento).filter(Boolean) : [];
  }, [apiRequest, normalizeLancamento]);

  const fetchCorretores = useCallback(async (forceRefresh = false) => {
    const data = await apiRequest('BUSCA_CORRETORES', {}, {}, forceRefresh);
    return Array.isArray(data) ? data : [];
  }, [apiRequest]);

  const fetchLogo = useCallback(async (params = {}, config = {}, forceRefresh = false) => {
    return apiRequest('LOGO', params, config, forceRefresh);
  }, [apiRequest]);

  const fetchAbouts = useCallback(async (params = {}, config = {}, forceRefresh = false) => {
    return apiRequest('ABOUTS', params, config, forceRefresh);
  }, [apiRequest]);

  const fetchContact = useCallback(async (params = {}, config = {}, forceRefresh = false) => {
    return apiRequest('CONTACT', params, config, forceRefresh);
  }, [apiRequest]);

  const fetchNewsletter = useCallback(async (email) => {
    if (!email || !email.includes('@')) {
        throw new Error('Por favor, insira um e-mail válido');
    }

    try {
        const response = await apiRequest('NEWSLETTER', { email });
        
        if (response === undefined || response.status === 200) {
            return { success: true, message: 'Inscrição realizada com sucesso!' };
        }
        
        return {
            success: true,
            message: response.message || 'Inscrição realizada com sucesso!'
        };
        
    } catch (error) {
        const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Erro ao processar sua inscrição';
        const customError = new Error(errorMessage);
        customError.response = error.response;
        throw customError;
    }
  }, [apiRequest]);

  const fetchCallRequest = useCallback(async (callData) => {
    if (!callData?.name || !callData?.email || !callData?.phone) {
        throw new Error('Por favor, preencha todos os campos obrigatórios');
    }

    try {
        const response = await apiRequest('CALL_REQUEST', callData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response === undefined || response.status === 200) {
            return { 
                success: true, 
                message: 'Solicitação enviada com sucesso!' 
            };
        }

        return {
            success: response.success || true,
            message: response.message || 'Solicitação enviada com sucesso!',
            data: response.data || null
        };

    } catch (error) {
        console.error('Error in fetchCallRequest:', error);
        
        const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Erro ao enviar solicitação';
        
        const customError = new Error(errorMessage);
        customError.response = error.response;
        throw customError;
    }
  }, [apiRequest]);

  const fetchAgendamentos = useCallback(async (params = {}, config = {}, forceRefresh = false) => {
    return apiRequest('AGENDAMENTOS', params, {
      ...config,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers
      }
    }, forceRefresh);
  }, [apiRequest]);

  const fetchBanners = useCallback(async (params = {}, config = {}, forceRefresh = false) => {
    return apiRequest('BANNERS', params, config, forceRefresh);
  }, [apiRequest]);

  // Effects
  useEffect(() => {
    const storedToken = localStorage.getItem('sigavi_token');
    const tokenExpiry = localStorage.getItem('sigavi_token_expiry');
    
    if (storedToken && tokenExpiry && Date.now() < parseInt(tokenExpiry)) {
      setToken(storedToken);
    } else {
      localStorage.removeItem('sigavi_token');
      localStorage.removeItem('sigavi_token_expiry');
      authenticate();
    }
  }, [authenticate]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const clearCache = useCallback((endpointKey, params = {}) => {
    const cacheKey = getCacheKey(endpointKey, params);
    localStorage.removeItem(cacheKey);
  }, []);

  const clearAllCache = useCallback(() => {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(CACHE_CONFIG.PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  }, []);

  return (
    <SigaviApiContext.Provider value={{ 
      authenticate, 
      apiRequest,
      error,
      loading,
      clearCache,
      clearAllCache,
      fetchLogo,
      fetchAbouts,
      fetchContact,
      fetchNewsletter,
      fetchCallRequest,
      fetchAgendamentos,
      fetchBanners,
      fetchImoveis,
      fetchLancamentos,
      fetchCorretores,
      endpoints: { 
        ...API_CONFIG.EXTERNAL.ENDPOINTS, 
        ...API_CONFIG.INTERNAL.ENDPOINTS 
      }
    }}>
      {children}
      
      <Backdrop open={loading} sx={{ zIndex: 9999 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
      
      <Snackbar open={!!error} autoHideDuration={5000}>
        <Alert severity="error" action={
          <Button color="inherit" size="small" onClick={() => setError(null)}>
            FECHAR
          </Button>
        }>
          {typeof error === 'object' ? JSON.stringify(error) : error}
        </Alert>
      </Snackbar>
    </SigaviApiContext.Provider>
  );
};

export const useSigaviApi = () => {
  const context = useContext(SigaviApiContext);
  if (!context) {
    throw new Error('useSigaviApi must be used within a SigaviApiProvider');
  }
  return context;
};