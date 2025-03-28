import React, { useState, useEffect, useContext, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Box,
  Button,
  Divider,
  CircularProgress,
  Slider as MuiSlider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  TextField,
  Alert,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  Badge,
  Tooltip
} from "@mui/material";
import {
  Bed as BedIcon,
  Bathtub as BathtubIcon,
  DirectionsCar as CarIcon,
  CropSquare as AreaIcon,
  CalendarToday as CalendarIcon,
  Phone as PhoneIcon,
  ArrowBackIos as ArrowBackIosIcon,
  ArrowForwardIos as ArrowForwardIosIcon,
  FilterAlt as FilterIcon,
  Clear as ClearIcon,
  Star as StarIcon,
  Info as InfoIcon
} from "@mui/icons-material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ThemeContext } from "../context/ThemeContext";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format } from "date-fns";
import { useSigaviApi } from "../services/api";

const CustomArrow = ({ direction, onClick }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      zIndex: 2,
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      color: "#fff",
      "&:hover": {
        backgroundColor: "rgba(0, 0, 0, 0.9)",
      },
      left: direction === "left" ? 10 : "auto",
      right: direction === "right" ? 10 : "auto",
    }}
  >
    {direction === "left" ? <ArrowBackIosIcon /> : <ArrowForwardIosIcon />}
  </IconButton>
);

const CustomDots = ({ total, current }) => (
  <Box sx={{
    position: 'absolute',
    bottom: 10,
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: '#fff',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '14px',
    zIndex: 2,
    fontWeight: 'bold'
  }}>
    {current + 1}/{total}
  </Box>
);

const getColors = (isDarkMode) => ({
  primary: isDarkMode ? "#90caf9" : "#1976d2",
  secondary: isDarkMode ? "#f48fb1" : "#ff4081",
  background: isDarkMode ? "#121212" : "#f5f5f5",
  paper: isDarkMode ? "#1e1e1e" : "#ffffff",
  text: isDarkMode ? "#ffffff" : "#333333",
  textSecondary: isDarkMode ? "#b0b0b0" : "#666666",
  accent: isDarkMode ? "#69f0ae" : "#00c853",
  error: isDarkMode ? "#ef5350" : "#d32f2f",
  divider: isDarkMode ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)",
});

const formatCurrency = (value) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value || 0);
};

const formatDate = (date) => {
  if (!date) return "";
  return date.toLocaleDateString("pt-BR", {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const TodosImoveis = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useContext(ThemeContext);
  const colors = getColors(isDarkMode);
  const { 
    fetchImoveis, 
    fetchLancamentos, 
    error: apiError,
  } = useSigaviApi();

  // Estados
  const [filtroPrincipal, setFiltroPrincipal] = useState("Todos");
  const [filtrosAdicionais, setFiltrosAdicionais] = useState({
    bairro: "",
    valorMin: 0,
    valorMax: 5000000,
    quartos: "",
    vagas: "",
    areaMin: 0,
    areaMax: 500,
    tipoOperacao: "",
    destaque: false,
  });
  const [imoveisData, setImoveisData] = useState({
    imoveis: [],
    lancamentos: [],
    loading: true,
    usingCache: false
  });
  const [agendamentoState, setAgendamentoState] = useState({
    open: false,
    etapa: "selecao",
    imovel: null,
    data: null,
    hora: "",
    error: null
  });
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [currentSlideIndex, setCurrentSlideIndex] = useState({});
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const horariosDisponiveis = useMemo(() => 
    ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'], 
    []
  );
  
  const imoveisPorPagina = 6;

  // Carregamento dos dados
  useEffect(() => {
    let mounted = true;
    
    const loadData = async () => {
      try {
        if (mounted) {
          setImoveisData(prev => ({ ...prev, loading: true, usingCache: true }));
          
          const [imoveisData, lancamentosData] = await Promise.all([
            fetchImoveis().catch(() => []),
            fetchLancamentos().catch(() => [])
          ]);
          
          if (mounted) {
            setImoveisData({
              imoveis: imoveisData || [],
              lancamentos: lancamentosData || [],
              loading: false,
              usingCache: false
            });
          }
        }
      } catch (error) {
        console.error("Erro ao carregar imóveis:", error);
        if (mounted) {
          setImoveisData(prev => ({ ...prev, loading: false }));
        }
      }
    };
  
    loadData();
    
    return () => { mounted = false; };
  }, [fetchImoveis, fetchLancamentos]);

  // Configuração do carrossel
  const getCarouselSettings = useCallback((imovelId, totalFotos) => ({
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <CustomArrow direction="left" />,
    nextArrow: <CustomArrow direction="right" />,
    beforeChange: (current, next) => setCurrentSlideIndex(prev => ({
      ...prev,
      [imovelId]: next
    })),
    customPaging: () => (
      <CustomDots total={totalFotos} current={currentSlideIndex[imovelId] || 0} />
    )
  }), [currentSlideIndex]);

  // Filtragem e ordenação
  const filteredImoveis = useMemo(() => {
    const { imoveis, lancamentos } = imoveisData;
    
    let allImoveis = [
      ...imoveis,
      ...lancamentos
    ];

    // Aplicar filtros
    allImoveis = allImoveis.filter(imovel => {
      // Filtro principal
      if (filtroPrincipal === "Lançamentos" && !imovel.isLancamento) return false;
      if (filtroPrincipal === "Venda" && imovel.TipoOperacao !== "Venda") return false;
      if (filtroPrincipal === "Locação" && imovel.TipoOperacao !== "Locação") return false;
      
      // Filtros adicionais
      const { bairro, valorMin, valorMax, quartos, vagas, areaMin, areaMax, tipoOperacao, destaque } = filtrosAdicionais;
      
      if (bairro && !imovel.Bairro?.toLowerCase().includes(bairro.toLowerCase())) return false;
      
      const valorRelevante = imovel.TipoOperacao === "Locação" ? imovel.ValorLocacao : imovel.ValorVenda;
      if (valorRelevante < valorMin || valorRelevante > valorMax) return false;
      
      if (quartos && imovel.Dormitorios < quartos) return false;
      if (vagas && imovel.Vagas < vagas) return false;
      if (imovel.AreaTotal < areaMin || imovel.AreaTotal > areaMax) return false;
      if (tipoOperacao && imovel.TipoOperacao !== tipoOperacao) return false;
      if (destaque && !imovel.Destaque) return false;
      
      return true;
    });

    // Ordenar por destaque primeiro
    return [...allImoveis].sort((a, b) => {
      if (a.Destaque && !b.Destaque) return -1;
      if (!a.Destaque && b.Destaque) return 1;
      return 0;
    });
  }, [imoveisData, filtroPrincipal, filtrosAdicionais]);

  // Opções disponíveis para filtros
  const availableFilters = useMemo(() => {
    const options = {
      bairros: new Set(),
      minQuartos: Infinity,
      maxQuartos: 0,
      minVagas: Infinity,
      maxVagas: 0,
      minValor: Infinity,
      maxValor: 0,
      minArea: Infinity,
      maxArea: 0,
      tipoOperacoes: new Set()
    };

    filteredImoveis.forEach(imovel => {
      if (imovel.Bairro) options.bairros.add(imovel.Bairro);
      if (imovel.Dormitorios) {
        options.minQuartos = Math.min(options.minQuartos, imovel.Dormitorios);
        options.maxQuartos = Math.max(options.maxQuartos, imovel.Dormitorios);
      }
      if (imovel.Vagas) {
        options.minVagas = Math.min(options.minVagas, imovel.Vagas);
        options.maxVagas = Math.max(options.maxVagas, imovel.Vagas);
      }
      
      const valorRelevante = imovel.TipoOperacao === "Locação" ? imovel.ValorLocacao : imovel.ValorVenda;
      if (valorRelevante) {
        options.minValor = Math.min(options.minValor, valorRelevante);
        options.maxValor = Math.max(options.maxValor, valorRelevante);
      }
      
      if (imovel.AreaTotal) {
        options.minArea = Math.min(options.minArea, imovel.AreaTotal);
        options.maxArea = Math.max(options.maxArea, imovel.AreaTotal);
      }
      if (imovel.TipoOperacao) options.tipoOperacoes.add(imovel.TipoOperacao);
    });

    return {
      bairros: Array.from(options.bairros).sort(),
      minQuartos: options.minQuartos === Infinity ? 0 : options.minQuartos,
      maxQuartos: options.maxQuartos === 0 ? 5 : options.maxQuartos,
      minVagas: options.minVagas === Infinity ? 0 : options.minVagas,
      maxVagas: options.maxVagas === 0 ? 4 : options.maxVagas,
      minValor: options.minValor === Infinity ? 0 : options.minValor,
      maxValor: options.maxValor === 0 ? 5000000 : options.maxValor,
      minArea: options.minArea === Infinity ? 0 : options.minArea,
      maxArea: options.maxArea === 0 ? 500 : options.maxArea,
      tipoOperacoes: Array.from(options.tipoOperacoes)
    };
  }, [filteredImoveis]);

  // Paginação
  const imoveisPaginaAtual = useMemo(() => {
    const indiceUltimoImovel = paginaAtual * imoveisPorPagina;
    const indicePrimeiroImovel = indiceUltimoImovel - imoveisPorPagina;
    return filteredImoveis.slice(indicePrimeiroImovel, indiceUltimoImovel);
  }, [filteredImoveis, paginaAtual]);

  const totalPaginas = Math.ceil(filteredImoveis.length / imoveisPorPagina);

  // Handlers
  const handleAbrirAgendamento = useCallback((imovel) => {
    setAgendamentoState({
      open: true,
      etapa: "selecao",
      imovel,
      data: null,
      hora: "",
      error: null
    });
  }, []);

  const handleConfirmarAgendamento = useCallback(() => {
    const { imovel, data, hora } = agendamentoState;
    
    if (!imovel || !data || !hora) {
      setAgendamentoState(prev => ({ ...prev, error: "Preencha todos os campos" }));
      return;
    }

    const agendamentoData = {
      imovel_id: imovel.id,
      titulo: imovel.Titulo || "Sem título",
      valor: imovel.TipoOperacao === "Locação" ? imovel.ValorLocacao : imovel.ValorVenda,
      bairro: imovel.Bairro || "Não informado",
      cidade: imovel.Cidade || "Não informado",
      data_visita: data.toISOString().split('T')[0],
      hora_visita: hora.replace(':', ''),
      data_formatada: format(new Date(data), "dd/MM/yyyy"),
      hora_formatada: hora
    };

    navigate("/agendamentos", { state: agendamentoData });
  }, [agendamentoState, navigate]);

  const handleResetFilters = useCallback(() => {
    setFiltroPrincipal("Todos");
    setFiltrosAdicionais({
      bairro: "",
      valorMin: availableFilters.minValor,
      valorMax: availableFilters.maxValor,
      quartos: "",
      vagas: "",
      areaMin: availableFilters.minArea,
      areaMax: availableFilters.maxArea,
      tipoOperacao: "",
      destaque: false,
    });
    setPaginaAtual(1);
  }, [availableFilters]);

  const handleFilterChange = useCallback((key, value) => {
    setFiltrosAdicionais(prev => {
      const newFilters = { ...prev, [key]: value };
      
      // Reset min/max values when neighborhood changes
      if (key === 'bairro') {
        const imoveisNoBairro = filteredImoveis.filter(i => 
          !value || i.Bairro?.toLowerCase().includes(value.toLowerCase())
        );
        
        if (imoveisNoBairro.length > 0) {
          const minValor = Math.min(...imoveisNoBairro.map(i => 
            i.TipoOperacao === "Locação" ? i.ValorLocacao : i.ValorVenda
          ));
          const maxValor = Math.max(...imoveisNoBairro.map(i => 
            i.TipoOperacao === "Locação" ? i.ValorLocacao : i.ValorVenda
          ));
          const minArea = Math.min(...imoveisNoBairro.map(i => i.AreaTotal));
          const maxArea = Math.max(...imoveisNoBairro.map(i => i.AreaTotal));
          
          newFilters.valorMin = minValor;
          newFilters.valorMax = maxValor;
          newFilters.areaMin = minArea;
          newFilters.areaMax = maxArea;
        }
      }
      
      return newFilters;
    });
    setPaginaAtual(1);
  }, [filteredImoveis]);

  const activeFilterCount = useMemo(() => {
    const defaultValues = {
      bairro: "",
      quartos: "",
      vagas: "",
      tipoOperacao: "",
      destaque: false,
      valorMin: availableFilters.minValor,
      valorMax: availableFilters.maxValor,
      areaMin: availableFilters.minArea,
      areaMax: availableFilters.maxArea
    };
    
    return Object.keys(filtrosAdicionais).filter(key => {
      const value = filtrosAdicionais[key];
      return value !== defaultValues[key];
    }).length + (filtroPrincipal !== "Todos" ? 1 : 0);
  }, [filtrosAdicionais, filtroPrincipal, availableFilters]);

  // Componentes
  const HorarioPicker = useCallback(() => (
    <FormControl fullWidth sx={{ mt: 2 }}>
      <InputLabel>Horário da Visita</InputLabel>
      <Select
        value={agendamentoState.hora}
        onChange={(e) => setAgendamentoState(prev => ({ ...prev, hora: e.target.value }))}
        required
        label="Horário da Visita"
      >
        {horariosDisponiveis.map(horario => (
          <MenuItem key={horario} value={horario}>{horario}</MenuItem>
        ))}
      </Select>
    </FormControl>
  ), [agendamentoState.hora, horariosDisponiveis]);

  const Paginacao = useCallback(() => (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 4, flexWrap: "wrap" }}>
      {Array.from({ length: totalPaginas }, (_, i) => (
        <Button
          key={i + 1}
          onClick={() => setPaginaAtual(i + 1)}
          variant={paginaAtual === i + 1 ? "contained" : "outlined"}
          sx={{
            mx: 0.5,
            mb: 1,
            minWidth: 36,
            backgroundColor: paginaAtual === i + 1 ? colors.primary : "transparent",
            color: paginaAtual === i + 1 ? "#fff" : colors.primary,
            border: `1px solid ${colors.primary}`,
            "&:hover": {
              backgroundColor: colors.primary,
              color: "#fff",
            },
          }}
        >
          {i + 1}
        </Button>
      ))}
    </Box>
  ), [totalPaginas, paginaAtual, colors.primary]);

  const ModalAgendamento = useCallback(() => (
    <Dialog 
      open={agendamentoState.open} 
      onClose={() => setAgendamentoState(prev => ({ ...prev, open: false }))} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: colors.paper,
          color: colors.text,
          borderRadius: 3
        }
      }}
    >
      <DialogTitle sx={{ pb: 2 }}>
        <Typography variant="h6">
          {agendamentoState.etapa === "selecao" ? "Agendar Visita" : "Confirmar Agendamento"}
        </Typography>
        <Typography variant="subtitle2" color="textSecondary">
          {agendamentoState.imovel?.Titulo || "Imóvel sem título"}
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          {agendamentoState.etapa === "selecao" ? (
            <Box sx={{ mt: 2 }}>
              {agendamentoState.error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {agendamentoState.error}
                </Alert>
              )}
              
              <DatePicker
                label="Data da visita"
                value={agendamentoState.data}
                onChange={(newValue) => setAgendamentoState(prev => ({ ...prev, data: newValue }))}
                minDate={new Date()}
                inputFormat="dd/MM/yyyy"
                shouldDisableDate={(date) => date.getDay() === 0 || date.getDay() === 6}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    fullWidth 
                    sx={{ mb: 2 }} 
                    helperText="Apenas dias úteis" 
                  />
                )}
              />
              
              <HorarioPicker />
              
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'flex-end', 
                gap: 2, 
                pt: 3, 
                mt: 2, 
                borderTop: 1, 
                borderColor: colors.divider 
              }}>
                <Button 
                  variant="outlined" 
                  onClick={() => setAgendamentoState(prev => ({ ...prev, open: false }))}
                  sx={{
                    borderColor: colors.primary,
                    color: colors.primary,
                    borderRadius: 2
                  }}
                >
                  Cancelar
                </Button>
                <Button 
                  variant="contained" 
                  onClick={() => {
                    if (!agendamentoState.data || !agendamentoState.hora) {
                      setAgendamentoState(prev => ({ ...prev, error: "Selecione data e horário" }));
                    } else {
                      setAgendamentoState(prev => ({ ...prev, error: null, etapa: "confirmacao" }));
                    }
                  }}
                  sx={{
                    backgroundColor: colors.primary,
                    borderRadius: 2,
                    '&:hover': {
                      backgroundColor: colors.secondary
                    }
                  }}
                >
                  Continuar
                </Button>
              </Box>
            </Box>
          ) : (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>Confirmação de Agendamento</Typography>
              
              <Box sx={{ 
                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)', 
                p: 3, 
                borderRadius: 2,
                mb: 3
              }}>
                <Typography><strong>Imóvel:</strong> {agendamentoState.imovel?.Titulo || "Sem título"}</Typography>
                <Typography><strong>Endereço:</strong> {agendamentoState.imovel?.Bairro || "Não informado"}, {agendamentoState.imovel?.Cidade || "Não informado"}</Typography>
                <Typography><strong>Valor:</strong> {formatCurrency(
                  agendamentoState.imovel?.TipoOperacao === "Locação" 
                    ? agendamentoState.imovel?.ValorLocacao 
                    : agendamentoState.imovel?.ValorVenda
                )}</Typography>
                <Typography><strong>Data:</strong> {formatDate(agendamentoState.data)}</Typography>
                <Typography><strong>Horário:</strong> {agendamentoState.hora}</Typography>
              </Box>
              
              <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                Um corretor entrará em contato para confirmar os detalhes.
              </Typography>
              
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                gap: 2, 
                pt: 2, 
                borderTop: 1, 
                borderColor: colors.divider 
              }}>
                <Button 
                  variant="outlined" 
                  onClick={() => setAgendamentoState(prev => ({ ...prev, etapa: "selecao" }))}
                  startIcon={<CalendarIcon />}
                  sx={{
                    borderColor: colors.primary,
                    color: colors.primary,
                    borderRadius: 2
                  }}
                >
                  Reagendar
                </Button>
                <Button 
                  variant="contained" 
                  onClick={handleConfirmarAgendamento}
                  startIcon={<PhoneIcon />}
                  sx={{
                    backgroundColor: colors.primary,
                    borderRadius: 2,
                    '&:hover': {
                      backgroundColor: colors.secondary
                    }
                  }}
                >
                  Confirmar Visita
                </Button>
              </Box>
            </Box>
          )}
        </LocalizationProvider>
      </DialogContent>
    </Dialog>
  ), [agendamentoState, colors, isDarkMode, handleConfirmarAgendamento]);

  return (
    <Box sx={{ 
      p: { xs: 2, md: 3 }, 
      backgroundColor: colors.background, 
      minHeight: '100vh',
      overflowX: 'hidden'
    }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ 
          color: colors.text,
          fontWeight: 'bold'
        }}>
          {filtroPrincipal === "Lançamentos" ? "Lançamentos" : "Imóveis Disponíveis"}
        </Typography>
        {filteredImoveis.length > 0 && (
          <Typography variant="subtitle1" component="p" color="textSecondary">
            {filteredImoveis.length} imóveis encontrados {imoveisData.usingCache && "(dados do cache)"}
          </Typography>
        )}
      </Box>
      <Divider sx={{ mb: 3, borderColor: colors.divider }} />

      {/* Filtros Principais */}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3, alignItems: 'center' }}>
        <ToggleButtonGroup
          value={filtroPrincipal}
          exclusive
          onChange={(_, newValue) => {
            if (newValue) {
              setFiltroPrincipal(newValue);
              setPaginaAtual(1);
              handleFilterChange('bairro', "");
            }
          }}
          aria-label="Filtro principal"
          sx={{
            '& .MuiToggleButton-root': {
              textTransform: 'none',
              borderColor: colors.primary,
              color: colors.primary,
              borderRadius: 2,
              px: 3,
              py: 1,
              '&.Mui-selected': {
                backgroundColor: colors.primary,
                color: '#fff',
              },
              '&:hover': {
                backgroundColor: isDarkMode ? 'rgba(144, 202, 249, 0.16)' : 'rgba(25, 118, 210, 0.08)',
              }
            }
          }}
        >
          {["Todos", "Lançamentos", "Venda", "Locação"].map((filtro) => (
            <ToggleButton key={filtro} value={filtro}>
              {filtro}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            endIcon={
              activeFilterCount > 0 ? (
                <Badge badgeContent={activeFilterCount} color="primary" />
              ) : null
            }
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            sx={{
              textTransform: 'none',
              borderColor: colors.primary,
              color: colors.primary,
              borderRadius: 2,
              px: 3,
              py: 1,
            }}
          >
            Filtros Avançados
          </Button>

          {activeFilterCount > 0 && (
            <Button
              variant="text"
              startIcon={<ClearIcon />}
              onClick={handleResetFilters}
              sx={{
                textTransform: 'none',
                color: colors.error,
                borderRadius: 2,
                px: 3,
                py: 1,
              }}
            >
              Limpar Filtros
            </Button>
          )}
        </Box>
      </Box>

      {/* Filtros Avançados */}
      {showAdvancedFilters && (
        <Box sx={{ 
          mb: 4,
          p: 3, 
          backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', 
          borderRadius: 2,
          border: `1px solid ${colors.divider}`
        }}>
          <Typography variant="h6" gutterBottom sx={{ color: colors.text }}>
            Filtros Avançados
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: colors.text }}>Bairro</InputLabel>
                <Select
                  value={filtrosAdicionais.bairro}
                  onChange={(e) => handleFilterChange('bairro', e.target.value)}
                  sx={{ 
                    backgroundColor: colors.paper,
                    color: colors.text,
                    borderRadius: 2,
                  }}
                  label="Bairro"
                >
                  <MenuItem value="">Todos</MenuItem>
                  {availableFilters.bairros.map(bairro => (
                    <MenuItem key={bairro} value={bairro}>{bairro}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" sx={{ color: colors.text }}>
                  Faixa de Valor
                </Typography>
                <Tooltip title="Intervalo de valores do imóvel">
                  <InfoIcon sx={{ color: colors.textSecondary, ml: 1, fontSize: '1rem' }} />
                </Tooltip>
              </Box>
              <MuiSlider
                value={[filtrosAdicionais.valorMin, filtrosAdicionais.valorMax]}
                onChange={(_, newValue) => {
                  handleFilterChange('valorMin', newValue[0]);
                  handleFilterChange('valorMax', newValue[1]);
                }}
                min={availableFilters.minValor}
                max={availableFilters.maxValor}
                step={Math.max(10000, Math.floor((availableFilters.maxValor - availableFilters.minValor) / 20))}
                valueLabelDisplay="auto"
                valueLabelFormat={formatCurrency}
                sx={{ color: colors.primary }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: -1 }}>
                <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                  {formatCurrency(availableFilters.minValor)}
                </Typography>
                <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                  {formatCurrency(availableFilters.maxValor)}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: colors.text }}>Mín. de Quartos</InputLabel>
                <Select
                  value={filtrosAdicionais.quartos}
                  onChange={(e) => handleFilterChange('quartos', e.target.value)}
                  sx={{ 
                    backgroundColor: colors.paper,
                    color: colors.text,
                    borderRadius: 2,
                  }}
                  label="Mín. de Quartos"
                >
                  <MenuItem value="">Qualquer</MenuItem>
                  {Array.from({ length: availableFilters.maxQuartos }, (_, i) => i + 1).map(num => (
                    <MenuItem key={num} value={num}>{num} {num > 1 ? 'quartos' : 'quarto'}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" sx={{ color: colors.text }}>
                  Área (m²)
                </Typography>
                <Tooltip title="Área total do imóvel">
                  <InfoIcon sx={{ color: colors.textSecondary, ml: 1, fontSize: '1rem' }} />
                </Tooltip>
              </Box>
              <MuiSlider
                value={[filtrosAdicionais.areaMin, filtrosAdicionais.areaMax]}
                onChange={(_, newValue) => {
                  handleFilterChange('areaMin', newValue[0]);
                  handleFilterChange('areaMax', newValue[1]);
                }}
                min={availableFilters.minArea}
                max={availableFilters.maxArea}
                step={10}
                valueLabelDisplay="auto"
                sx={{ color: colors.primary }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: -1 }}>
                <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                  {availableFilters.minArea}m²
                </Typography>
                <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                  {availableFilters.maxArea}m²
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: colors.text }}>Mín. de Vagas</InputLabel>
                <Select
                  value={filtrosAdicionais.vagas}
                  onChange={(e) => handleFilterChange('vagas', e.target.value)}
                  sx={{ 
                    backgroundColor: colors.paper,
                    color: colors.text,
                    borderRadius: 2,
                  }}
                  label="Mín. de Vagas"
                >
                  <MenuItem value="">Qualquer</MenuItem>
                  {Array.from({ length: availableFilters.maxVagas }, (_, i) => i + 1).map(num => (
                    <MenuItem key={num} value={num}>{num} {num > 1 ? 'vagas' : 'vaga'}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: colors.text }}>Tipo de Operação</InputLabel>
                <Select
                  value={filtrosAdicionais.tipoOperacao}
                  onChange={(e) => handleFilterChange('tipoOperacao', e.target.value)}
                  sx={{ 
                    backgroundColor: colors.paper,
                    color: colors.text,
                    borderRadius: 2,
                  }}
                  label="Tipo de Operação"
                >
                  <MenuItem value="">Todos</MenuItem>
                  {availableFilters.tipoOperacoes.map(op => (
                    <MenuItem key={op} value={op}>{op}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: colors.text }}>Destaque</InputLabel>
                <Select
                  value={filtrosAdicionais.destaque}
                  onChange={(e) => handleFilterChange('destaque', e.target.value)}
                  sx={{ 
                    backgroundColor: colors.paper,
                    color: colors.text,
                    borderRadius: 2,
                  }}
                  label="Destaque"
                >
                  <MenuItem value={false}>Todos</MenuItem>
                  <MenuItem value={true}>Apenas Destaques</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Resultados */}
      {imoveisData.loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress size={60} sx={{ color: colors.primary }} />
        </Box>
      ) : apiError ? (
        <Alert severity="error" sx={{ mb: 3 }}>{apiError}</Alert>
      ) : filteredImoveis.length === 0 ? (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '300px',
          textAlign: 'center',
          p: 3
        }}>
          <Typography variant="h6" sx={{ color: colors.text, mb: 2 }}>
            Nenhum imóvel encontrado com os filtros selecionados
          </Typography>
          <Button
            variant="outlined"
            onClick={handleResetFilters}
            sx={{
              borderColor: colors.primary,
              color: colors.primary,
              borderRadius: 2,
              px: 3
            }}
          >
            Limpar Filtros
          </Button>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {imoveisPaginaAtual.map((imovel) => (
              <Grid item xs={12} sm={6} md={4} key={imovel.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: colors.paper,
                    position: 'relative',
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: `0 10px 20px ${isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.15)'}`
                    }
                  }}
                >
                  {imovel.Destaque && (
                    <Box sx={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      zIndex: 3,
                      backgroundColor: colors.accent,
                      color: '#fff',
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                    }}>
                      <StarIcon sx={{ fontSize: '1rem', mr: 0.5 }} />
                      <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                        Destaque
                      </Typography>
                    </Box>
                  )}

                  {/* Carrossel de Fotos */}
                  <Box sx={{ position: 'relative', height: 300 }}>
                    {imovel.Fotos && imovel.Fotos.length > 0 ? (
                      <Slider {...getCarouselSettings(imovel.id, imovel.Fotos.length)}>
                        {imovel.Fotos.map((foto, index) => (
                          <Box key={index} sx={{ height: 300 }}>
                            <CardMedia
                              component="img"
                              image={foto.Url}
                              alt={foto.Descricao || "Imóvel"}
                              sx={{
                                height: '100%',
                                width: '100%',
                                objectFit: 'cover'
                              }}
                              loading="lazy"
                            />
                          </Box>
                        ))}
                      </Slider>
                    ) : (
                      <Box sx={{
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: isDarkMode ? '#333' : '#f5f5f5'
                      }}>
                        <Typography variant="body2" sx={{ color: colors.text }}>
                          Sem imagens
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Typography 
                        variant="h6" 
                        component="h3" 
                        sx={{ 
                          mb: 1,
                          color: colors.text,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          minHeight: '3rem',
                          pr: 1,
                          fontWeight: '600'
                        }}
                      >
                        {imovel.Titulo || "Imóvel sem título"}
                      </Typography>
                      {imovel.isLancamento && (
                        <Chip 
                          label="Lançamento" 
                          size="small" 
                          sx={{ 
                            backgroundColor: colors.secondary,
                            color: '#fff',
                            fontWeight: 'bold',
                            height: '24px'
                          }} 
                        />
                      )}
                    </Box>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      <Tooltip title="Quartos">
                        <Chip 
                          icon={<BedIcon sx={{ fontSize: '16px' }} />} 
                          label={`${imovel.Dormitorios || 0}`} 
                          size="small" 
                          sx={{ 
                            backgroundColor: isDarkMode ? 'rgba(144, 202, 249, 0.16)' : 'rgba(25, 118, 210, 0.08)',
                            minWidth: '50px'
                          }}
                        />
                      </Tooltip>
                      <Tooltip title="Banheiros">
                        <Chip 
                          icon={<BathtubIcon sx={{ fontSize: '16px' }} />} 
                          label={`${imovel.Banheiros || 0}`} 
                          size="small" 
                          sx={{ 
                            backgroundColor: isDarkMode ? 'rgba(144, 202, 249, 0.16)' : 'rgba(25, 118, 210, 0.08)',
                            minWidth: '50px'
                          }}
                        />
                      </Tooltip>
                      {imovel.Vagas > 0 && (
                        <Tooltip title="Vagas">
                          <Chip 
                            icon={<CarIcon sx={{ fontSize: '16px' }} />} 
                            label={`${imovel.Vagas}`} 
                            size="small" 
                            sx={{ 
                              backgroundColor: isDarkMode ? 'rgba(144, 202, 249, 0.16)' : 'rgba(25, 118, 210, 0.08)',
                              minWidth: '50px'
                            }}
                          />
                        </Tooltip>
                      )}
                      {imovel.AreaTotal > 0 && (
                        <Tooltip title="Área (m²)">
                          <Chip 
                            icon={<AreaIcon sx={{ fontSize: '16px' }} />} 
                            label={`${imovel.AreaTotal}`} 
                            size="small" 
                            sx={{ 
                              backgroundColor: isDarkMode ? 'rgba(144, 202, 249, 0.16)' : 'rgba(25, 118, 210, 0.08)',
                              minWidth: '50px'
                            }}
                          />
                        </Tooltip>
                      )}
                    </Box>

                    <Typography variant="body2" sx={{ color: colors.text, mb: 1 }}>
                      <strong>Bairro:</strong> {imovel.Bairro || "Não informado"}
                    </Typography>

                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: colors.accent,
                        fontWeight: 'bold',
                        mt: 1,
                        fontSize: '1.25rem'
                      }}
                    >
                      {formatCurrency(
                        imovel.TipoOperacao === "Locação" ? imovel.ValorLocacao : imovel.ValorVenda
                      )}
                    </Typography>
                  </CardContent>

                  <Box sx={{ p: 2, display: 'flex', gap: 2 }}>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => navigate(`/imovel/${imovel.id}`)}
                      sx={{
                        borderColor: colors.primary,
                        color: colors.primary,
                        borderRadius: 2,
                        '&:hover': {
                          backgroundColor: colors.primary,
                          color: '#fff'
                        }
                      }}
                    >
                      Detalhes
                    </Button>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => handleAbrirAgendamento(imovel)}
                      sx={{
                        backgroundColor: colors.primary,
                        borderRadius: 2,
                        '&:hover': {
                          backgroundColor: colors.secondary
                        }
                      }}
                    >
                      Agendar
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>

          {totalPaginas > 1 && <Paginacao />}
        </>
      )}

      <ModalAgendamento />
    </Box>
  );
};

export default TodosImoveis;