import React, { useContext } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Skeleton,
  Box,
  Button,
  Divider,
  IconButton,
} from "@mui/material";
import BedIcon from "@mui/icons-material/Bed";
import BathtubIcon from "@mui/icons-material/Bathtub";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import HomeIcon from "@mui/icons-material/Home";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { keyframes } from "@emotion/react";
import AnimatedSection from '../Animated/AnimatedSection';
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";

// Animação de fade-in
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Componente de seta personalizada
const CustomArrow = ({ direction, onClick, hidden }) => {
  if (hidden) return null;

  return (
    <IconButton
      onClick={onClick}
      sx={{
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        color: "#fff",
        "&:hover": {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
        },
        left: direction === "left" ? 0 : "auto",
        right: direction === "right" ? 0 : "auto",
      }}
    >
      {direction === "left" ? <ArrowBackIosIcon /> : <ArrowForwardIosIcon />}
    </IconButton>
  );
};

// Formatar valor em Reais
const formatarValor = (valor) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
};

// Função para verificar se é um lançamento
const isLancamento = (imovel) => {
  return imovel.Tipologias && imovel.Fase;
};

const ImoveisList = ({ imoveis, loading }) => {
  const navigate = useNavigate();
  const { isDarkMode } = useContext(ThemeContext);

  // Cores dinâmicas com base no tema
  const colors = {
    primary: isDarkMode ? "#90caf9" : "#1976d2",
    secondary: isDarkMode ? "#f48fb1" : "#ff4081",
    background: isDarkMode ? "#121212" : "#f5f5f5",
    text: isDarkMode ? "#ffffff" : "#333333",
    accent: isDarkMode ? "#69f0ae" : "#00c853",
    error: isDarkMode ? "#ef5350" : "#d32f2f",
  };

  // Agrupar imóveis por tipo
  const imoveisPorTipo = imoveis.reduce((acc, imovel) => {
    const tipo = imovel.Tipo || "Outros";
    if (!acc[tipo]) {
      acc[tipo] = [];
    }
    acc[tipo].push(imovel);
    return acc;
  }, {});

  // Configurações do carrossel
  const settings = (imoveisDoTipo) => ({
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: Math.min(4, imoveisDoTipo.length),
    slidesToScroll: 1,
    prevArrow: <CustomArrow direction="left" hidden={imoveisDoTipo.length <= 4} />,
    nextArrow: <CustomArrow direction="right" hidden={imoveisDoTipo.length <= 4} />,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: Math.min(3, imoveisDoTipo.length),
        },
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: Math.min(2, imoveisDoTipo.length),
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  });

  // Função para navegar para a página de detalhes do imóvel
  const handleCardClick = (imovelId) => {
    navigate(`/imovel/${imovelId}`);
  };

  return (
    <>
      {loading ? (
        <AnimatedSection animation="fade-up" delay="100">
          <Grid container spacing={3}>
            {[...Array(6)].map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <Skeleton variant="rectangular" height={400} />
                  <CardContent>
                    <Skeleton variant="text" width="80%" />
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="50%" />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </AnimatedSection>
      ) : (
        Object.entries(imoveisPorTipo).map(([tipo, imoveisDoTipo], index) => (
          <AnimatedSection key={tipo} animation="fade-up" delay={`${(index + 1) * 100}`}>
            <Box sx={{ mb: 4, animation: `${fadeIn} 0.5s ease-in-out` }}>
              <Typography variant="h5" component="h3" gutterBottom sx={{ mb: 2, color: colors.text }}>
                {tipo}
              </Typography>
              <Divider sx={{ mb: 3, borderColor: colors.text }} />
              <Slider {...settings(imoveisDoTipo)}>
                {imoveisDoTipo.slice(0, 5).map((imovel) => {
                  const isLanc = isLancamento(imovel);
                  const primeiraTipologia = isLanc ? imovel.Tipologias[0] : null;

                  return (
                    <Box key={imovel.Id} sx={{ px: 1, py: 2, height: "100%" }}>
                      <Card
                        sx={{
                          height: "500px",
                          display: "flex",
                          flexDirection: "column",
                          boxShadow: 3,
                          overflow: "hidden",
                          cursor: "pointer",
                          transition: "transform 0.3s ease",
                          "&:hover": {
                            transform: "scale(1.03)",
                          },
                          backgroundColor: isDarkMode ? "#333" : "#fff",
                        }}
                        onClick={() => handleCardClick(imovel.Id)}
                      >
                        <CardMedia
                          component="img"
                          height="200"
                          image={isLanc ? imovel.Fotos[0]?.Url : imovel.UrlFoto || "/img/default.jpg"}
                          alt={`Foto do imóvel ${imovel.Nome || imovel.Titulo}`}
                          sx={{ objectFit: "cover" }}
                        />
                        <CardContent
                          sx={{
                            flexGrow: 1,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center", // Centraliza horizontalmente
                            justifyContent: "center", // Centraliza verticalmente
                            gap: 1,
                            padding: "16px",
                            textAlign: "center", // Centraliza o texto
                          }}
                        >
                          <Typography
                            variant="h6"
                            component="h3"
                            sx={{
                              fontWeight: "bold",
                              fontSize: "1.1rem",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              minHeight: "3rem",
                              mb: 1,
                              color: colors.text,
                            }}
                          >
                            {isLanc ? imovel.Nome : imovel.Titulo || "Imóvel sem nome"}
                          </Typography>
                          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, width: "100%" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
                              <HomeIcon sx={{ fontSize: "1rem", color: colors.text }} />
                              <Typography variant="body2" sx={{ color: colors.text }}>
                                Tipo: {imovel.Tipo}
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
                              <CropSquareIcon sx={{ fontSize: "1rem", color: colors.text }} />
                              <Typography variant="body2" sx={{ color: colors.text }}>
                                Área Total: {isLanc ? primeiraTipologia?.AreaTotal : imovel.AreaTotal}m²
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
                              <BedIcon sx={{ fontSize: "1rem", color: colors.text }} />
                              <Typography variant="body2" sx={{ color: colors.text }}>
                                Dormitórios: {isLanc ? primeiraTipologia?.Dormitorios : imovel.Dormitorio}
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
                              <BathtubIcon sx={{ fontSize: "1rem", color: colors.text }} />
                              <Typography variant="body2" sx={{ color: colors.text }}>
                                Banheiros: {isLanc ? primeiraTipologia?.WC : imovel.WC}
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
                              <DirectionsCarIcon sx={{ fontSize: "1rem", color: colors.text }} />
                              <Typography variant="body2" sx={{ color: colors.text }}>
                                Vagas: {isLanc ? primeiraTipologia?.Vagas : imovel.Vaga}
                              </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ color: colors.text, mt: 1 }}>
                              <strong>Bairro:</strong> {imovel.Bairro}
                            </Typography>
                            <Typography variant="body2" sx={{ color: colors.accent, fontWeight: "bold", mt: 1 }}>
                              {formatarValor(isLanc ? primeiraTipologia?.Valor : imovel.ValorVenda)}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Box>
                  );
                })}
              </Slider>
              {imoveisDoTipo.length > 5 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                  <Button variant="contained" sx={{ backgroundColor: colors.primary }}>
                    Ver Mais {tipo}
                  </Button>
                </Box>
              )}
            </Box>
          </AnimatedSection>
        ))
      )}
    </>
  );
};

export default ImoveisList;