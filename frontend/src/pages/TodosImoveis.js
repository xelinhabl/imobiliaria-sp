import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Box,
  Button,
  Divider,
  IconButton,
  CircularProgress,
  Slider as MuiSlider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import BedIcon from "@mui/icons-material/Bed";
import BathtubIcon from "@mui/icons-material/Bathtub";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AnimatedSection from "../components/Animated/AnimatedSection";
import { motion } from "framer-motion";

// Paleta de cores
const colors = {
  primary: "#1976d2", // Azul primário
  secondary: "#ff4081", // Rosa secundário
  background: "#f5f5f5", // Fundo claro
  text: "#333", // Texto escuro
  accent: "#00c853", // Verde de destaque
  error: "#d32f2f", // Vermelho para erros
};

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

const TodosImoveis = () => {
  const navigate = useNavigate();
  const [tipoSelecionado, setTipoSelecionado] = useState(null);
  const [filtrosAdicionais, setFiltrosAdicionais] = useState({
    finalidade: "",
    bairro: "",
    valorMin: 0,
    valorMax: 5000000,
    quartos: "",
    vagas: "",
    areaMin: 0,
    areaMax: 500,
  });
  const [imoveis, setImoveis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [imoveisPorPagina] = useState(6);

  // Buscar dados dos imóveis
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
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        setError("Falha ao carregar os dados.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrar imóveis com base nos filtros selecionados
  const imoveisFiltrados = imoveis.filter((imovel) => {
    const filtroTipo = !tipoSelecionado || imovel.Tipo === tipoSelecionado;
    const filtroFinalidade =
      !filtrosAdicionais.finalidade || imovel.Finalidade === filtrosAdicionais.finalidade;
    const filtroBairro =
      !filtrosAdicionais.bairro || imovel.Bairro === filtrosAdicionais.bairro;
    const filtroValor =
      !isNaN(imovel.ValorVenda) &&
      imovel.ValorVenda >= filtrosAdicionais.valorMin &&
      imovel.ValorVenda <= filtrosAdicionais.valorMax;
    const filtroQuartos =
      !filtrosAdicionais.quartos || (imovel.Dormitorio && imovel.Dormitorio >= filtrosAdicionais.quartos);
    const filtroVagas =
      !filtrosAdicionais.vagas || (imovel.Vaga && imovel.Vaga >= filtrosAdicionais.vagas);
    const filtroArea =
      !isNaN(imovel.AreaTotal) &&
      imovel.AreaTotal >= filtrosAdicionais.areaMin &&
      imovel.AreaTotal <= filtrosAdicionais.areaMax;

    return (
      filtroTipo &&
      filtroFinalidade &&
      filtroBairro &&
      filtroValor &&
      filtroQuartos &&
      filtroVagas &&
      filtroArea
    );
  });

  // Atualizar tipos de imóveis disponíveis com base nos filtros
  const tiposImoveisDisponiveis = [...new Set(imoveisFiltrados.map((imovel) => imovel.Tipo))];

  // Configurações do carrossel de fotos
  const settingsFotos = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <CustomArrow direction="left" />,
    nextArrow: <CustomArrow direction="right" />,
  };

  // Calcular índices dos imóveis a serem exibidos
  const indiceUltimoImovel = paginaAtual * imoveisPorPagina;
  const indicePrimeiroImovel = indiceUltimoImovel - imoveisPorPagina;
  const imoveisPaginaAtual = imoveisFiltrados.slice(indicePrimeiroImovel, indiceUltimoImovel);

  // Função para mudar de página
  const mudarPagina = (numeroPagina) => setPaginaAtual(numeroPagina);

  // Renderizar a paginação
  const Paginacao = () => {
    const numeroPaginas = Math.ceil(imoveisFiltrados.length / imoveisPorPagina);
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        {Array.from({ length: numeroPaginas }, (_, i) => (
          <Button
            key={i + 1}
            onClick={() => mudarPagina(i + 1)}
            variant={paginaAtual === i + 1 ? "contained" : "outlined"}
            sx={{ mx: 1, backgroundColor: colors.primary, color: "#fff" }}
          >
            {i + 1}
          </Button>
        ))}
      </Box>
    );
  };

  // Animação para os cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <Box sx={{ p: 3, backgroundColor: colors.background }}>
      <AnimatedSection animation="fade-up" delay="100">
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: colors.text }}>
          Encontre o Imóvel Ideal
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {/* Botões de seleção de tipo de imóvel */}
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 4 }}>
          <Button
            variant={!tipoSelecionado ? "contained" : "outlined"}
            onClick={() => setTipoSelecionado(null)}
            sx={{
              backgroundColor: !tipoSelecionado ? colors.primary : "transparent",
              color: !tipoSelecionado ? "#fff" : colors.primary,
              border: `2px solid ${colors.primary}`,
              borderRadius: "12px",
              padding: "10px 20px",
              fontSize: "1rem",
              fontWeight: "bold",
              textTransform: "uppercase",
              "&:hover": {
                backgroundColor: !tipoSelecionado ? colors.secondary : colors.primary,
                color: "#fff",
              },
            }}
          >
            Todos
          </Button>
          {tiposImoveisDisponiveis.map((tipo) => (
            <Button
              key={tipo}
              variant={tipoSelecionado === tipo ? "contained" : "outlined"}
              onClick={() => setTipoSelecionado(tipo)}
              sx={{
                backgroundColor: tipoSelecionado === tipo ? colors.primary : "transparent",
                color: tipoSelecionado === tipo ? "#fff" : colors.primary,
                border: `2px solid ${colors.primary}`,
                borderRadius: "12px",
                padding: "10px 20px",
                fontSize: "1rem",
                fontWeight: "bold",
                textTransform: "uppercase",
                "&:hover": {
                  backgroundColor: tipoSelecionado === tipo ? colors.secondary : colors.primary,
                  color: "#fff",
                },
              }}
            >
              {tipo}
            </Button>
          ))}
        </Box>

        {/* Filtros adicionais */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ color: colors.text }}>
            Filtros Adicionais
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Finalidade</InputLabel>
                <Select
                  value={filtrosAdicionais.finalidade}
                  onChange={(e) =>
                    setFiltrosAdicionais({
                      ...filtrosAdicionais,
                      finalidade: e.target.value,
                    })
                  }
                  sx={{ backgroundColor: "#fff" }}
                >
                  <MenuItem value="">Todos</MenuItem>
                  {[...new Set(imoveisFiltrados.map((imovel) => imovel.Finalidade))].map((finalidade) => (
                    <MenuItem key={finalidade} value={finalidade}>
                      {finalidade}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Bairro</InputLabel>
                <Select
                  value={filtrosAdicionais.bairro}
                  onChange={(e) =>
                    setFiltrosAdicionais({
                      ...filtrosAdicionais,
                      bairro: e.target.value,
                    })
                  }
                  sx={{ backgroundColor: "#fff" }}
                >
                  <MenuItem value="">Todos</MenuItem>
                  {[...new Set(imoveisFiltrados.map((imovel) => imovel.Bairro))].map((bairro) => (
                    <MenuItem key={bairro} value={bairro}>
                      {bairro}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" sx={{ color: colors.text }}>
                Valor Mínimo: {formatarValor(filtrosAdicionais.valorMin)}
              </Typography>
              <MuiSlider
                value={filtrosAdicionais.valorMin}
                onChange={(e, newValue) =>
                  setFiltrosAdicionais({
                    ...filtrosAdicionais,
                    valorMin: newValue,
                  })
                }
                min={0}
                max={5000000}
                step={10000}
                sx={{ color: colors.primary }}
              />
              <Typography variant="body2" sx={{ color: colors.text }}>
                Valor Máximo: {formatarValor(filtrosAdicionais.valorMax)}
              </Typography>
              <MuiSlider
                value={filtrosAdicionais.valorMax}
                onChange={(e, newValue) =>
                  setFiltrosAdicionais({
                    ...filtrosAdicionais,
                    valorMax: newValue,
                  })
                }
                min={0}
                max={5000000}
                step={10000}
                sx={{ color: colors.primary }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Quartos</InputLabel>
                <Select
                  value={filtrosAdicionais.quartos}
                  onChange={(e) =>
                    setFiltrosAdicionais({
                      ...filtrosAdicionais,
                      quartos: e.target.value,
                    })
                  }
                  sx={{ backgroundColor: "#fff" }}
                >
                  <MenuItem value="">Todos</MenuItem>
                  {[...new Set(imoveisFiltrados.map((imovel) => imovel.Dormitorio))].sort((a, b) => a - b).map((num) => (
                    <MenuItem key={num} value={num}>
                      {num} {num > 1 ? "quartos" : "quarto"}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Vagas</InputLabel>
                <Select
                  value={filtrosAdicionais.vagas}
                  onChange={(e) =>
                    setFiltrosAdicionais({
                      ...filtrosAdicionais,
                      vagas: e.target.value,
                    })
                  }
                  sx={{ backgroundColor: "#fff" }}
                >
                  <MenuItem value="">Todos</MenuItem>
                  {[...new Set(imoveisFiltrados.map((imovel) => imovel.Vaga))].sort((a, b) => a - b).map((num) => (
                    <MenuItem key={num} value={num}>
                      {num} {num > 1 ? "vagas" : "vaga"}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" sx={{ color: colors.text }}>
                Área Mínima: {filtrosAdicionais.areaMin}m²
              </Typography>
              <MuiSlider
                value={filtrosAdicionais.areaMin}
                onChange={(e, newValue) =>
                  setFiltrosAdicionais({
                    ...filtrosAdicionais,
                    areaMin: newValue,
                  })
                }
                min={0}
                max={500}
                step={10}
                sx={{ color: colors.primary }}
              />
              <Typography variant="body2" sx={{ color: colors.text }}>
                Área Máxima: {filtrosAdicionais.areaMax}m²
              </Typography>
              <MuiSlider
                value={filtrosAdicionais.areaMax}
                onChange={(e, newValue) =>
                  setFiltrosAdicionais({
                    ...filtrosAdicionais,
                    areaMax: newValue,
                  })
                }
                min={0}
                max={500}
                step={10}
                sx={{ color: colors.primary }}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Exibir loading ou erro */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress sx={{ color: colors.primary }} />
          </Box>
        ) : error ? (
          <Typography color="error" align="center" sx={{ color: colors.error }}>
            {error}
          </Typography>
        ) : (
          <>
            <Grid container spacing={3}>
              {imoveisPaginaAtual.map((imovel) => (
                <Grid item xs={12} sm={6} md={4} key={imovel.Id}>
                  <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        boxShadow: 3,
                        borderRadius: "12px",
                        overflow: "hidden",
                        cursor: "pointer",
                        transition: "transform 0.3s ease",
                        "&:hover": {
                          transform: "scale(1.03)",
                        },
                      }}
                      onClick={() => navigate(`/imovel/${imovel.Id}`)}
                    >
                      {/* Carrossel de fotos */}
                      {imovel.Fotos && imovel.Fotos.length > 0 ? (
                        <Slider {...settingsFotos}>
                          {imovel.Fotos.map((foto) => (
                            <CardMedia
                              key={foto.Id}
                              component="img"
                              height="200"
                              image={foto.Url}
                              alt={foto.Descricao}
                              sx={{ objectFit: "cover" }}
                            />
                          ))}
                        </Slider>
                      ) : (
                        <Typography variant="body2" sx={{ color: colors.text, textAlign: "center", p: 2 }}>
                          Nenhuma foto disponível
                        </Typography>
                      )}

                      <CardContent
                        sx={{
                          flexGrow: 1,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: 2,
                          padding: "16px",
                          textAlign: "center",
                        }}
                      >
                        <Typography
                          variant="h6"
                          component="h3"
                          sx={{
                            fontWeight: "bold",
                            fontSize: "1rem",
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
                          {imovel.Titulo || "Imóvel sem nome"}
                        </Typography>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "center" }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <CropSquareIcon sx={{ fontSize: "1rem", color: colors.text }} />
                            <Typography variant="body2" sx={{ color: colors.text }}>
                              Área Total: {imovel.AreaTotal}m²
                            </Typography>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <BedIcon sx={{ fontSize: "1rem", color: colors.text }} />
                            <Typography variant="body2" sx={{ color: colors.text }}>
                              Dormitórios: {imovel.Dormitorio}
                            </Typography>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <BathtubIcon sx={{ fontSize: "1rem", color: colors.text }} />
                            <Typography variant="body2" sx={{ color: colors.text }}>
                              Banheiros: {imovel.WC}
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ color: colors.text, mt: 1 }}>
                            <strong>Bairro:</strong> {imovel.Bairro}
                          </Typography>
                          <Typography variant="body2" sx={{ color: colors.accent, fontWeight: "bold", mt: 1 }}>
                            {formatarValor(imovel.ValorVenda)}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
            <Paginacao />
          </>
        )}
      </AnimatedSection>
    </Box>
  );
};

export default TodosImoveis;