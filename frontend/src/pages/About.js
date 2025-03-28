import React, { useState, useEffect } from "react";
import { Container, Grid, Typography, Box, useTheme, Paper, Fade } from "@mui/material";
import { keyframes } from "@emotion/react";
import { useSigaviApi } from "../services/api";

// Animação de fade-in
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const LOCAL_API_BASE_URL = "http://127.0.0.1:8000"; // Define the local API base URL

const About = () => {
  const [aboutData, setAboutData] = useState({ foto: "", descricao: "" });
  const theme = useTheme();
  const { apiRequest } = useSigaviApi();

  // Busca os dados do backend
  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const data = await apiRequest('ABOUT_DATA');
        setAboutData(data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchAboutData();
  }, [apiRequest]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 2,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
          Sobre Nós
        </Typography>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Fade in={true} timeout={1000}>
              <Box
                component="img"
                src={aboutData.foto ? `${LOCAL_API_BASE_URL}${aboutData.foto}` : "/img/default.jpg"}
                alt="Foto sobre nós"
                sx={{
                  width: "100%",
                  borderRadius: 2,
                  boxShadow: 3,
                  animation: `${fadeIn} 1s ease-in-out`,
                }}
              />
            </Fade>
          </Grid>
          <Grid item xs={12} md={6}>
            <Fade in={true} timeout={1500}>
              <Typography
                variant="body1"
                sx={{
                  fontSize: "1.1rem",
                  lineHeight: 1.6,
                  animation: `${fadeIn} 1.5s ease-in-out`,
                }}
              >
                {aboutData.descricao || "Carregando descrição..."}
              </Typography>
            </Fade>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default About;