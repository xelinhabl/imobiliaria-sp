import React from "react";
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
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { keyframes } from "@emotion/react";
import AnimatedSection from '../Animated/AnimatedSection'; // Componente de seção animada
import { useNavigate } from "react-router-dom"; // Importe useNavigate

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

const ImoveisList = ({ imoveis, loading }) => {
  const navigate = useNavigate(); // Hook para navegação

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

  // Conjunto para armazenar chaves únicas de imóveis já exibidos
  const imoveisExibidos = new Set();

  // Função para gerar uma chave única com base no ID e no título do imóvel
  const gerarChaveUnica = (imovel) => {
    return `${imovel.Id}-${imovel.Titulo}`;
  };

  // Função para navegar para a página de detalhes do imóvel
  const handleCardClick = (imovelId) => {
    navigate(`/imovel/${imovelId}`); // Navega para a rota de detalhes do imóvel
  };

  return (
    <>
      {loading ? (
        <AnimatedSection animation="fade-up" delay="100">
          <Grid container spacing={3}>
            {[...Array(6)].map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <Skeleton variant="rectangular" height={400} /> {/* Altura fixa para o skeleton */}
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
              <Typography variant="h5" component="h3" gutterBottom sx={{ mb: 2 }}>
                {tipo}
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Slider {...settings(imoveisDoTipo)}>
                {imoveisDoTipo.slice(0, 5).map((imovel) => {
                  // Gera uma chave única para o imóvel
                  const chaveUnica = gerarChaveUnica(imovel);

                  // Verifica se o imóvel já foi exibido
                  if (imoveisExibidos.has(chaveUnica)) {
                    return null; // Pula imóveis repetidos
                  }
                  imoveisExibidos.add(chaveUnica); // Adiciona a chave ao conjunto de imóveis exibidos

                  return (
                    <Box key={imovel.Id} sx={{ px: 1, py: 2, height: "100%" }}> {/* Adicionado py: 2 para espaçamento vertical */}
                      <Card
                        sx={{
                          height: "450px", // Altura fixa para o card
                          display: "flex",
                          flexDirection: "column",
                          boxShadow: 3,
                          overflow: "hidden",
                          cursor: "pointer", // Adiciona cursor de ponteiro para indicar que é clicável
                          transition: "transform 0.3s ease", // Adiciona transição suave
                          "&:hover": {
                            transform: "scale(1.03)", // Efeito de zoom ao passar o mouse
                          },
                        }}
                        onClick={() => handleCardClick(imovel.Id)} // Redireciona ao clicar no card
                      >
                        <CardMedia
                          component="img"
                          height="200"
                          image={imovel.UrlFoto || "/img/default.jpg"}
                          alt={`Foto do imóvel ${imovel.Titulo}`}
                          sx={{ objectFit: "cover" }}
                        />
                        <CardContent
                          sx={{
                            flexGrow: 1,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center", // Centraliza o conteúdo verticalmente
                            alignItems: "center", // Centraliza o conteúdo horizontalmente
                            gap: 2, // Espaçamento entre os elementos internos
                            padding: "16px", // Espaçamento interno consistente
                            textAlign: "center", // Centraliza o texto
                          }}
                        >
                          <Typography
                            variant="h6"
                            component="h3"
                            sx={{
                              fontWeight: "bold",
                              fontSize: "1rem", // Tamanho da fonte reduzido
                              display: "-webkit-box",
                              WebkitLineClamp: 2, // Limita o título a 2 linhas
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              textOverflow: "ellipsis", // Adiciona "..." ao final do texto cortado
                              minHeight: "3rem", // Altura mínima para garantir consistência
                              mb: 1, // Espaçamento abaixo do título
                            }}
                          >
                            {imovel.Titulo || "Imóvel sem nome"}
                          </Typography>
                          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "center" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <CropSquareIcon sx={{ fontSize: "1rem" }} />
                              <Typography variant="body2" color="textSecondary">
                                Área Total: {imovel.AreaTotal}m²
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <BedIcon sx={{ fontSize: "1rem" }} />
                              <Typography variant="body2" color="textSecondary">
                                Dormitórios: {imovel.Dormitorio}
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <BathtubIcon sx={{ fontSize: "1rem" }} />
                              <Typography variant="body2" color="textSecondary">
                                Banheiros: {imovel.WC}
                              </Typography>
                            </Box>
                            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                              <strong>Bairro:</strong> {imovel.Bairro}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "gold", fontWeight: "bold", mt: 1 }}>
                              {formatarValor(imovel.ValorVenda)}
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
                  <Button variant="contained" color="primary">
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