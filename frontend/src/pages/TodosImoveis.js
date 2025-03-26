import React, { useState, useEffect, useContext } from "react";
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
  Chip
} from "@mui/material";
import {
  Bed as BedIcon,
  Bathtub as BathtubIcon,
  DirectionsCar as CarIcon,
  CropSquare as AreaIcon,
  CalendarToday as CalendarIcon,
  Phone as PhoneIcon,
  ArrowBackIos as ArrowBackIosIcon,
  ArrowForwardIos as ArrowForwardIosIcon
} from "@mui/icons-material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion } from "framer-motion";
import { ThemeContext } from "../context/ThemeContext";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format } from "date-fns";

const getColors = (isDarkMode) => ({
  primary: isDarkMode ? "#90caf9" : "#1976d2",
  secondary: isDarkMode ? "#f48fb1" : "#ff4081",
  background: isDarkMode ? "#121212" : "#f5f5f5",
  text: isDarkMode ? "#ffffff" : "#333333",
  accent: isDarkMode ? "#69f0ae" : "#00c853",
  error: isDarkMode ? "#ef5350" : "#d32f2f",
});

const CustomArrow = ({ direction, onClick }) => (
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
      left: direction === "left" ? 10 : "auto",
      right: direction === "right" ? 10 : "auto",
    }}
  >
    {direction === "left" ? <ArrowBackIosIcon /> : <ArrowForwardIosIcon />}
  </IconButton>
);

const formatCurrency = (value) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value || 0);
};

const formatDate = (date) => {
  return date?.toLocaleDateString("pt-BR", {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const normalizeImovelData = (imovel) => {
  return {
    ...imovel,
    Id: imovel.Id,
    Titulo: imovel.Titulo || imovel.Nome || "Imóvel sem título",
    ValorVenda: imovel.ValorVenda || imovel.Valor || 0,
    Dormitorios: imovel.Dormitorios || imovel.Dormitorio || 0,
    Banheiros: imovel.WC || imovel.Banheiros || 0,
    Vagas: imovel.Vagas || imovel.Vaga || 0,
    AreaTotal: imovel.AreaTotal || 0,
    Bairro: imovel.Bairro || "",
    Cidade: imovel.Cidade || "",
    Fotos: imovel.Fotos || [],
    Tipo: imovel.Tipo || (imovel.Empreendimento ? "Lançamento" : "Imóvel")
  };
};

const TodosImoveis = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useContext(ThemeContext);
  const colors = getColors(isDarkMode);

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
  });
  const [imoveis, setImoveis] = useState([]);
  const [lancamentos, setLancamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [imoveisPorPagina] = useState(6);
  const [openAgendamento, setOpenAgendamento] = useState(false);
  const [dataVisita, setDataVisita] = useState(null);
  const [horaVisita, setHoraVisita] = useState("");
  const [etapaAgendamento, setEtapaAgendamento] = useState("selecao");
  const [selectedImovel, setSelectedImovel] = useState(null);
  const [agendamentoError, setAgendamentoError] = useState(null);
  const [loadingImages, setLoadingImages] = useState({});

  const horariosDisponiveis = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

  // Configurações do carrossel
  const settingsFotos = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <CustomArrow direction="left" />,
    nextArrow: <CustomArrow direction="right" />,
  };

  // Buscar dados
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const authParams = new URLSearchParams();
        authParams.append("username", "integracao");
        authParams.append("password", "HScNneuN6PKxDq0");
        authParams.append("grant_type", "password");

        const authResponse = await axios.post(
          "https://cmarqx.sigavi360.com.br/Sigavi/api/Acesso/Token",
          authParams,
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );

        const token = authResponse.data.access_token;

        const [imoveisResponse, lancamentosResponse] = await Promise.all([
          axios.post("https://cmarqx.sigavi360.com.br/Sigavi/Api/Site/BuscaEmpreendimento", {}, {
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
          }),
          axios.post("https://cmarqx.sigavi360.com.br/Sigavi/Api/Site/Busca", {}, {
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
          })
        ]);

        const imoveisUnicos = imoveisResponse.data.reduce((acc, imovel) => {
          if (!acc.some(item => item.Id === imovel.Id)) acc.push(imovel);
          return acc;
        }, []);

        setImoveis(imoveisUnicos);
        setLancamentos(lancamentosResponse.data);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        setError("Falha ao carregar os dados. Tente recarregar a página.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrar imóveis
  const imoveisFiltrados = (filtroPrincipal === "Lançamentos" ? lancamentos : imoveis)
    .map(normalizeImovelData)
    .filter(imovel => {
      const {
        bairro,
        valorMin,
        valorMax,
        quartos,
        vagas,
        areaMin,
        areaMax
      } = filtrosAdicionais;

      return (
        (!bairro || imovel.Bairro.toLowerCase().includes(bairro.toLowerCase())) &&
        imovel.ValorVenda >= valorMin &&
        imovel.ValorVenda <= valorMax &&
        (!quartos || imovel.Dormitorios >= quartos) &&
        (!vagas || imovel.Vagas >= vagas) &&
        imovel.AreaTotal >= areaMin &&
        imovel.AreaTotal <= areaMax
      );
    });

  // Paginação
  const indiceUltimoImovel = paginaAtual * imoveisPorPagina;
  const indicePrimeiroImovel = indiceUltimoImovel - imoveisPorPagina;
  const imoveisPaginaAtual = imoveisFiltrados.slice(indicePrimeiroImovel, indiceUltimoImovel);
  const totalPaginas = Math.ceil(imoveisFiltrados.length / imoveisPorPagina);

  // Componentes
  const HorarioPicker = () => (
    <FormControl fullWidth sx={{ mt: 2 }}>
      <InputLabel>Horário da Visita</InputLabel>
      <Select
        value={horaVisita}
        onChange={(e) => setHoraVisita(e.target.value)}
        required
        label="Horário da Visita"
      >
        {horariosDisponiveis.map(horario => (
          <MenuItem key={horario} value={horario}>{horario}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  const Paginacao = () => (
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
  );

  const ModalAgendamento = () => (
    <Dialog open={openAgendamento} onClose={() => setOpenAgendamento(false)} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 2 }}>
        <Typography variant="h6">
          {etapaAgendamento === "selecao" ? "Agendar Visita" : "Confirmar Agendamento"}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          {selectedImovel?.Titulo}
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          {etapaAgendamento === "selecao" ? (
            <Box sx={{ mt: 2 }}>
              {agendamentoError && <Alert severity="error" sx={{ mb: 2 }}>{agendamentoError}</Alert>}
              
              <DatePicker
                label="Data da visita"
                value={dataVisita}
                onChange={setDataVisita}
                minDate={new Date("DD/MM/YYYY")}
                inputFormat="DD/MM/YYYY"
                shouldDisableDate={(date) => date.getDay() === 0 || date.getDay() === 6}
                renderInput={(params) => (
                  <TextField {...params} fullWidth sx={{ mb: 2 }} helperText="Apenas dias úteis" />
                )}
              />
              
              <HorarioPicker />
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, pt: 3, mt: 2, borderTop: 1, borderColor: 'divider' }}>
                <Button variant="outlined" onClick={() => setOpenAgendamento(false)}>
                  Cancelar
                </Button>
                <Button 
                  variant="contained" 
                  onClick={() => {
                    if (!dataVisita || !horaVisita) {
                      setAgendamentoError("Selecione data e horário");
                    } else {
                      setAgendamentoError(null);
                      setEtapaAgendamento("confirmacao");
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
                backgroundColor: 'rgba(0, 0, 0, 0.04)', 
                p: 3, 
                borderRadius: 1,
                mb: 3
              }}>
                <Typography><strong>Imóvel:</strong> {selectedImovel?.Titulo}</Typography>
                <Typography><strong>Endereço:</strong> {selectedImovel?.Bairro}, {selectedImovel?.Cidade}</Typography>
                <Typography><strong>Valor:</strong> {formatCurrency(selectedImovel?.ValorVenda)}</Typography>
                <Typography><strong>Data:</strong> {formatDate(dataVisita)}</Typography>
                <Typography><strong>Horário:</strong> {horaVisita}</Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Um corretor entrará em contato para confirmar os detalhes.
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                <Button 
                  variant="outlined" 
                  onClick={() => setEtapaAgendamento("selecao")}
                  startIcon={<CalendarIcon />}
                >
                  Reagendar
                </Button>
                <Button 
                  variant="contained" 
                  onClick={handleConfirmarAgendamento}
                  startIcon={<PhoneIcon />}
                >
                  Confirmar Visita
                </Button>
              </Box>
            </Box>
          )}
        </LocalizationProvider>
      </DialogContent>
    </Dialog>
  );

  // Handlers
  const handleAbrirAgendamento = (imovel) => {
    setSelectedImovel(imovel);
    setOpenAgendamento(true);
    setEtapaAgendamento("selecao");
    setDataVisita(null);
    setHoraVisita("");
    setAgendamentoError(null);
  };

  const handleConfirmarAgendamento = () => {
    const agendamentoData = {
      imovel_id: selectedImovel.Id,
      titulo: selectedImovel.Titulo,
      valor: selectedImovel.ValorVenda,
      bairro: selectedImovel.Bairro,
      cidade: selectedImovel.Cidade,
      data_visita: dataVisita.toISOString().split('T')[0],
      hora_visita: horaVisita.replace(':', ''),
      data_formatada: format(new Date(dataVisita), "DD/MM/yyyy"),
      hora_formatada: horaVisita
    };
  
    navigate("/agendamentos", { state: agendamentoData });
  };

  const handleImageLoad = (id) => {
    setLoadingImages(prev => ({ ...prev, [id]: false }));
  };

  // Animação
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <Box sx={{ p: 3, backgroundColor: colors.background, minHeight: '100vh' }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: colors.text }}>
        {filtroPrincipal === "Lançamentos" ? "Lançamentos" : "Imóveis Disponíveis"}
      </Typography>
      <Divider sx={{ mb: 3, borderColor: colors.text }} />

      {/* Filtros Principais */}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
        {["Todos", "Lançamentos", "Venda", "Locação"].map((filtro) => (
          <Button
            key={filtro}
            variant={filtroPrincipal === filtro ? "contained" : "outlined"}
            onClick={() => {
              setFiltroPrincipal(filtro);
              setPaginaAtual(1);
            }}
            sx={{
              textTransform: 'none',
              backgroundColor: filtroPrincipal === filtro ? colors.primary : 'transparent',
              color: filtroPrincipal === filtro ? '#fff' : colors.primary,
              border: `1px solid ${colors.primary}`,
              '&:hover': {
                backgroundColor: filtroPrincipal === filtro ? colors.secondary : colors.primary,
                color: '#fff'
              }
            }}
          >
            {filtro}
          </Button>
        ))}
      </Box>

      {/* Filtros Avançados */}
      <Box sx={{ mb: 4, p: 3, backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ color: colors.text }}>Filtros Avançados</Typography>
        
        <Grid container spacing={2}>
          {/* Bairro */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: colors.text }}>Bairro</InputLabel>
              <Select
                value={filtrosAdicionais.bairro}
                onChange={(e) => {
                  setFiltrosAdicionais({ ...filtrosAdicionais, bairro: e.target.value });
                  setPaginaAtual(1);
                }}
                sx={{ 
                  backgroundColor: isDarkMode ? '#333' : '#fff',
                  color: colors.text
                }}
                label="Bairro"
              >
                <MenuItem value="">Todos</MenuItem>
                {[...new Set(imoveisFiltrados.map(i => i.Bairro))].filter(Boolean).map(bairro => (
                  <MenuItem key={bairro} value={bairro}>{bairro}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Valor */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2" sx={{ color: colors.text, mb: 1 }}>
              Faixa de Valor: {formatCurrency(filtrosAdicionais.valorMin)} - {formatCurrency(filtrosAdicionais.valorMax)}
            </Typography>
            <MuiSlider
              value={[filtrosAdicionais.valorMin, filtrosAdicionais.valorMax]}
              onChange={(_, newValue) => {
                setFiltrosAdicionais({
                  ...filtrosAdicionais,
                  valorMin: newValue[0],
                  valorMax: newValue[1]
                });
                setPaginaAtual(1);
              }}
              min={0}
              max={5000000}
              step={10000}
              valueLabelDisplay="auto"
              valueLabelFormat={formatCurrency}
              sx={{ color: colors.primary }}
            />
          </Grid>

          {/* Quartos */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: colors.text }}>Mín. de Quartos</InputLabel>
              <Select
                value={filtrosAdicionais.quartos}
                onChange={(e) => {
                  setFiltrosAdicionais({ ...filtrosAdicionais, quartos: e.target.value });
                  setPaginaAtual(1);
                }}
                sx={{ 
                  backgroundColor: isDarkMode ? '#333' : '#fff',
                  color: colors.text
                }}
                label="Mín. de Quartos"
              >
                <MenuItem value="">Qualquer</MenuItem>
                {[1, 2, 3, 4, 5].map(num => (
                  <MenuItem key={num} value={num}>{num} {num > 1 ? 'quartos' : 'quarto'}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Área */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2" sx={{ color: colors.text, mb: 1 }}>
              Área (m²): {filtrosAdicionais.areaMin} - {filtrosAdicionais.areaMax}
            </Typography>
            <MuiSlider
              value={[filtrosAdicionais.areaMin, filtrosAdicionais.areaMax]}
              onChange={(_, newValue) => {
                setFiltrosAdicionais({
                  ...filtrosAdicionais,
                  areaMin: newValue[0],
                  areaMax: newValue[1]
                });
                setPaginaAtual(1);
              }}
              min={0}
              max={500}
              step={10}
              valueLabelDisplay="auto"
              sx={{ color: colors.primary }}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Resultados */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress size={60} sx={{ color: colors.primary }} />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
      ) : imoveisPaginaAtual.length === 0 ? (
        <Typography variant="h6" align="center" sx={{ color: colors.text, mt: 4 }}>
          Nenhum imóvel encontrado com os filtros selecionados
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
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 3
                      },
                      backgroundColor: isDarkMode ? '#424242' : '#fff'
                    }}
                  >
                    {/* Carrossel de Fotos */}
                    <Box sx={{ position: 'relative', height: 200 }}>
                      {imovel.Fotos.length > 0 ? (
                        <Slider {...settingsFotos}>
                          {imovel.Fotos.map(foto => (
                            <Box key={foto.Id} sx={{ height: 200 }}>
                              <CardMedia
                                component="img"
                                image={foto.Url}
                                alt={foto.Descricao || "Imóvel"}
                                sx={{
                                  height: '100%',
                                  width: '100%',
                                  objectFit: 'cover',
                                  opacity: loadingImages[foto.Id] === false ? 1 : 0,
                                  transition: 'opacity 0.3s ease'
                                }}
                                onLoad={() => handleImageLoad(foto.Id)}
                                onError={() => handleImageLoad(foto.Id)}
                              />
                              {loadingImages[foto.Id] !== false && (
                                <Box sx={{
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  backgroundColor: isDarkMode ? '#333' : '#f5f5f5'
                                }}>
                                  <CircularProgress size={24} sx={{ color: colors.primary }} />
                                </Box>
                              )}
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
                          minHeight: '3rem'
                        }}
                      >
                        {imovel.Titulo}
                      </Typography>

                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                        <Chip 
                          icon={<BedIcon />} 
                          label={`${imovel.Dormitorios} quarto${imovel.Dormitorios > 1 ? 's' : ''}`} 
                          size="small" 
                        />
                        <Chip 
                          icon={<BathtubIcon />} 
                          label={`${imovel.Banheiros} banheiro${imovel.Banheiros > 1 ? 's' : ''}`} 
                          size="small" 
                        />
                        {imovel.Vagas > 0 && (
                          <Chip 
                            icon={<CarIcon />} 
                            label={`${imovel.Vagas} vaga${imovel.Vagas > 1 ? 's' : ''}`} 
                            size="small" 
                          />
                        )}
                        {imovel.AreaTotal > 0 && (
                          <Chip 
                            icon={<AreaIcon />} 
                            label={`${imovel.AreaTotal}m²`} 
                            size="small" 
                          />
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
                          mt: 1
                        }}
                      >
                        {formatCurrency(imovel.ValorVenda)}
                      </Typography>
                    </CardContent>

                    <Box sx={{ p: 2, display: 'flex', gap: 2 }}>
                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => navigate(`/imovel/${imovel.Id}`)}
                        sx={{
                          borderColor: colors.primary,
                          color: colors.primary,
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
                          '&:hover': {
                            backgroundColor: colors.secondary
                          }
                        }}
                      >
                        Agendar
                      </Button>
                    </Box>
                  </Card>
                </motion.div>
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