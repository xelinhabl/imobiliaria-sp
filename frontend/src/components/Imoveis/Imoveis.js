import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Skeleton,
  Container,
  Box,
  Button,
  Divider,
  IconButton,
} from "@mui/material";
import BedIcon from "@mui/icons-material/Bed"; // Ícone de cama
import BathtubIcon from "@mui/icons-material/Bathtub"; // Ícone de banheiro
import CropSquareIcon from "@mui/icons-material/CropSquare"; // Ícone de área
import Slider from "react-slick"; // Componente de carrossel
import "slick-carousel/slick/slick.css"; // Estilos do carrossel
import "slick-carousel/slick/slick-theme.css"; // Tema do carrossel
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos"; // Ícone de seta para trás
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"; // Ícone de seta para frente
import "./Imoveis.css"; // Estilos personalizados (se necessário)

const Imoveis = () => {
  const [imoveis, setImoveis] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImoveis = async () => {
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
      } catch (err) {
        console.error("Erro ao buscar dados dos imóveis:", err);
        setError("Falha ao carregar os imóveis.");
      } finally {
        setLoading(false);
      }
    };

    fetchImoveis();
  }, []);

  // Função para formatar o valor em Reais
  const formatarValor = (valor) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
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

  // Componente de seta personalizada
  const CustomArrow = ({ direction, onClick, hidden }) => {
    if (hidden) return null; // Não renderiza a seta se hidden for true

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

  // Configurações do carrossel
  const settings = (imoveisDoTipo) => ({
    dots: false, // Remove os pontos de navegação
    infinite: false, // Desativa navegação infinita
    speed: 500, // Velocidade da transição
    slidesToShow: Math.min(4, imoveisDoTipo.length), // Mostra 4 imóveis ou menos
    slidesToScroll: 1, // Número de slides a rolar por vez
    prevArrow: <CustomArrow direction="left" hidden={imoveisDoTipo.length <= 4} />, // Seta escondida se houver 4 ou menos imóveis
    nextArrow: <CustomArrow direction="right" hidden={imoveisDoTipo.length <= 4} />, // Seta escondida se houver 4 ou menos imóveis
    responsive: [
      {
        breakpoint: 1200, // Ajuste para telas menores
        settings: {
          slidesToShow: Math.min(3, imoveisDoTipo.length),
        },
      },
      {
        breakpoint: 900, // Ajuste para telas menores
        settings: {
          slidesToShow: Math.min(2, imoveisDoTipo.length),
        },
      },
      {
        breakpoint: 600, // Ajuste para telas menores
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  });

  return (
    <Container>
      <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mt: 4, mb: 2 }}>
        Imóveis Disponíveis
      </Typography>
      {error && (
        <Typography color="error" align="center">
          {error}
        </Typography>
      )}
      {loading ? (
        <Grid container spacing={3}>
          {[...Array(6)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                  <Skeleton variant="text" width="80%" />
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="50%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        Object.entries(imoveisPorTipo).map(([tipo, imoveisDoTipo]) => (
          <Box key={tipo} sx={{ mb: 4 }}>
            <Typography variant="h5" component="h3" gutterBottom>
              {tipo}
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Slider {...settings(imoveisDoTipo)}>
              {imoveisDoTipo.map((imovel) => (
                <Box key={imovel.Id} sx={{ px: 1 }}>
                  <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                    {/* Exibir o Id do imóvel */}
                    <Typography variant="body2" color="textSecondary" sx={{ p: 1 }}>
                      ID: {imovel.Id}
                    </Typography>

                    {/* Foto única do imóvel */}
                    <CardMedia
                      component="img"
                      height="200"
                      image={imovel.UrlFoto || "/img/default.jpg"}
                      alt={`Foto do imóvel ${imovel.Titulo}`}
                      sx={{ objectFit: "cover" }} // Garante que a imagem cubra o espaço sem distorcer
                    />

                    {/* Informações básicas */}
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                        {imovel.Titulo || "Imóvel sem nome"}
                      </Typography>
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        {/* Área Total */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <CropSquareIcon sx={{ fontSize: "1rem" }} />
                          <Typography variant="body2" color="textSecondary">
                            Área Total: {imovel.AreaTotal}m²
                          </Typography>
                        </Box>
                        {/* Dormitórios */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <BedIcon sx={{ fontSize: "1rem" }} />
                          <Typography variant="body2" color="textSecondary">
                            Dormitórios: {imovel.Dormitorio}
                          </Typography>
                        </Box>
                        {/* Banheiros */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <BathtubIcon sx={{ fontSize: "1rem" }} />
                          <Typography variant="body2" color="textSecondary">
                            Banheiros: {imovel.WC}
                          </Typography>
                        </Box>
                        {/* Bairro */}
                        <Typography variant="body2" color="textSecondary">
                          <strong>Bairro:</strong> {imovel.Bairro}
                        </Typography>
                        {/* Valor da Venda */}
                        <Typography variant="body2" sx={{ color: "gold", fontWeight: "bold" }}>
                          {formatarValor(imovel.ValorVenda)}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Slider>
            {imoveisDoTipo.length > 5 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                <Button variant="contained" color="primary">
                  Ver Mais {tipo}
                </Button>
              </Box>
            )}
          </Box>
        ))
      )}
    </Container>
  );
};

export default Imoveis;