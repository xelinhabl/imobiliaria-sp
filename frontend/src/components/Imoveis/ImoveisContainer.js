import React, { useEffect, useState } from "react";
import axios from "axios";
import ImoveisList from "./ImoveisList"; // Componente de exibição de imóveis
import CorretoresList from "../Colaboradores/CorretoresList"; // Componente de exibição de corretores
import { Container, Typography } from "@mui/material";
import AnimatedSection from "../Animated/AnimatedSection"; // Componente de seção animada

const ImoveisContainer = () => {
  const [imoveis, setImoveis] = useState([]);
  const [corretores, setCorretores] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        setError("Falha ao carregar os dados.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Container>
      <AnimatedSection animation="fade-up" delay="100">
        <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mt: 4, mb: 2 }}>
          Imóveis Disponíveis
        </Typography>
      </AnimatedSection>
      {error && (
        <AnimatedSection animation="fade-up" delay="200">
          <Typography color="error" align="center">
            {error}
          </Typography>
        </AnimatedSection>
      )}
      <AnimatedSection animation="fade-up" delay="300">
        <ImoveisList imoveis={imoveis} loading={loading} />
      </AnimatedSection>

      {/* Lista de Corretores */}
      <AnimatedSection animation="fade-up" delay="400">
        <CorretoresList corretores={corretores} />
      </AnimatedSection>
    </Container>
  );
};

export default ImoveisContainer;