import React, { useEffect, useState } from "react";
import axios from "axios";
import ImoveisList from "./ImoveisList"; // Componente de exibição de imóveis
import CorretoresList from "../Colaboradores/CorretoresList"; // Componente de exibição de corretores
import { Container, Typography } from "@mui/material";
import AnimatedSection from "../Animated/AnimatedSection"; // Componente de seção animada

const ImoveisContainer = () => {
  const [imoveis, setImoveis] = useState([]);
  const [lancamentos, setLancamentos] = useState([]); // Estado para os lançamentos
  const [corretores, setCorretores] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingLancamentos, setLoadingLancamentos] = useState(true); // Estado de loading para lançamentos

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Autenticação
        const authParams = new URLSearchParams();
        authParams.append("username", "integracao");
        authParams.append("password", "HScNneuN6PKxDq0");
        authParams.append("grant_type", "password");

        const authResponse = await axios.post(
          "https://cmarqx.sigavi360.com.br/Sigavi/api/Acesso/Token",
          authParams,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );

        const token = authResponse.data.access_token;

        // Buscar dados dos imóveis
        const imoveisResponse = await axios.post(
          "https://cmarqx.sigavi360.com.br/Sigavi/Api/Site/Busca",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Remover imóveis duplicados com base no Id
        const imoveisUnicos = imoveisResponse.data.reduce((acc, imovel) => {
          if (!acc.some((item) => item.Id === imovel.Id)) {
            acc.push(imovel);
          }
          return acc;
        }, []);

        setImoveis(imoveisUnicos || []);

        // Buscar dados dos lançamentos
        const lancamentosResponse = await axios.post(
          "https://cmarqx.sigavi360.com.br/Sigavi/Api/Site/BuscaEmpreendimento",
          {}, // Body vazio
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Verificar se a resposta contém dados válidos
        if (lancamentosResponse.data && Array.isArray(lancamentosResponse.data)) {
          // Remover lançamentos duplicados com base no Id
          const lancamentosUnicos = lancamentosResponse.data.reduce((acc, lancamento) => {
            if (!acc.some((item) => item.Id === lancamento.Id)) {
              // Ordenar as fotos para garantir que a ordem "1" seja a primeira
              lancamento.Fotos = lancamento.Fotos.sort((a, b) => a.Ordem - b.Ordem);
              acc.push(lancamento);
            }
            return acc;
          }, []);

          setLancamentos(lancamentosUnicos || []);
        } else {
          console.warn("Dados dos lançamentos inválidos:", lancamentosResponse.data);
          setLancamentos([]);
        }

        // Buscar dados dos corretores
        const corretoresResponse = await axios.post(
          "https://cmarqx.sigavi360.com.br/TH/Api/Autonomo/Busca",
          {}, // Corpo vazio, pois a requisição não precisa de parâmetros
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Verificar se a resposta contém dados válidos
        if (corretoresResponse.data && Array.isArray(corretoresResponse.data)) {
          setCorretores(corretoresResponse.data);
        } else {
          console.warn("Dados dos corretores inválidos:", corretoresResponse.data);
          setCorretores([]);
        }

        // Limpar erro se a requisição for bem-sucedida
        setError(null);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        setError("Falha ao carregar os dados.");
      } finally {
        setLoading(false);
        setLoadingLancamentos(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Container>
      {/* Seção de Lançamentos */}
      <AnimatedSection animation="fade-up" delay="100">
        <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mt: 4, mb: 2 }}>
          Lançamentos
        </Typography>
      </AnimatedSection>
      <AnimatedSection animation="fade-up" delay="200">
        <ImoveisList imoveis={lancamentos} loading={loadingLancamentos} />
      </AnimatedSection>

      {/* Seção de Imóveis Disponíveis */}
      <AnimatedSection animation="fade-up" delay="300">
        <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mt: 4, mb: 2 }}>
          Imóveis Disponíveis
        </Typography>
      </AnimatedSection>
      {error && (
        <AnimatedSection animation="fade-up" delay="400">
          <Typography color="error" align="center">
            {error}
          </Typography>
        </AnimatedSection>
      )}
      <AnimatedSection animation="fade-up" delay="500">
        <ImoveisList imoveis={imoveis} loading={loading} />
      </AnimatedSection>

      {/* Lista de Corretores */}
      <AnimatedSection animation="fade-up" delay="600">
        <CorretoresList corretores={corretores} />
      </AnimatedSection>
    </Container>
  );
};

export default ImoveisContainer;