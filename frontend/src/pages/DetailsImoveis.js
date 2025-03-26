import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  CircularProgress,
  Container,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Divider,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Stack,
  IconButton,
  Tabs,
  Tab,
  Fade
} from "@mui/material";
import {
  Bed as BedIcon,
  Bathtub as BathtubIcon,
  DirectionsCar as CarIcon,
  CropSquare as AreaIcon,
  Home as HomeIcon,
  LocationOn as LocationIcon,
  MonetizationOn as PriceIcon,
  Star as StarIcon,
  ExpandMore as ExpandMoreIcon,
  Map as MapIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  ArrowBackIos as ArrowBackIcon,
  ArrowForwardIos as ArrowForwardIcon,
  MeetingRoom as RoomIcon,
  FitnessCenter as GymIcon,
  Pool as PoolIcon,
  LocalLaundryService as LaundryIcon,
  Kitchen as KitchenIcon,
  AcUnit as AirConditionerIcon,
  Garage as GarageIcon,
  Security as SecurityIcon,
  Wifi as WifiIcon,
  Elevator as ElevatorIcon,
  Checkroom as WardrobeIcon,
  Tv as TvIcon
} from "@mui/icons-material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AnimatedSection from "../components/Animated/AnimatedSection";
import Map from "./Map";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format } from "date-fns";
import ptBR from 'date-fns/locale/pt-BR';

// Mapeamento de ícones para características
const characteristicIcons = {
  'dormitório': <BedIcon />,
  'banheiro': <BathtubIcon />,
  'vaga': <CarIcon />,
  'garagem': <GarageIcon />,
  'área': <AreaIcon />,
  'piscina': <PoolIcon />,
  'academia': <GymIcon />,
  'lavanderia': <LaundryIcon />,
  'cozinha': <KitchenIcon />,
  'ar condicionado': <AirConditionerIcon />,
  'segurança': <SecurityIcon />,
  'wifi': <WifiIcon />,
  'elevador': <ElevatorIcon />,
  'armário': <WardrobeIcon />,
  'tv': <TvIcon />,
  'sala': <RoomIcon />
};

const DetailsImoveis = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [imovel, setImovel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openAgendamento, setOpenAgendamento] = useState(false);
  const [dataVisita, setDataVisita] = useState(() => {
    const initialDate = new Date();
    initialDate.setHours(0, 0, 0, 0);
    return initialDate;
  });
  const [horaVisita, setHoraVisita] = useState("");
  const [etapaAgendamento, setEtapaAgendamento] = useState("selecao");
  const [agendamentoError, setAgendamentoError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loadingImages, setLoadingImages] = useState({});
  const [activeTab, setActiveTab] = useState('fotos');
  const [mediaToShow, setMediaToShow] = useState([]);

  const horariosDisponiveis = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

  // Configurações do carrossel de fotos
  const settingsFotos = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: (current, next) => setCurrentSlide(next),
    nextArrow: <CustomArrow direction="right" />,
    prevArrow: <CustomArrow direction="left" />,
  };

  // Componente de seta personalizada para o carrossel
  function CustomArrow({ direction, onClick }) {
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
          left: direction === "left" ? 10 : "auto",
          right: direction === "right" ? 10 : "auto",
        }}
      >
        {direction === "left" ? <ArrowBackIcon /> : <ArrowForwardIcon />}
      </IconButton>
    );
  }

  // Buscar dados do imóvel
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

        const response = await axios.get(
          `https://cmarqx.sigavi360.com.br/Sigavi/Api/Site/GetFichaTecnicaEmpreendimento/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setImovel(response.data);
      } catch (err) {
        console.error("Erro ao buscar imóvel:", err);
        setError("Não foi possível carregar os detalhes do imóvel.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Atualizar mídia para mostrar quando a tab ou imóvel mudar
  useEffect(() => {
    if (!imovel) return;
    
    if (activeTab === 'fotos') {
      setMediaToShow(imovel.Fotos || []);
    } else if (activeTab === 'plantas') {
      setMediaToShow(imovel.Plantas || []);
    }
  }, [activeTab, imovel]);

  // Normalizar dados do imóvel
  const normalizeImovelData = (imovel) => {
    if (!imovel) return null;
    
    // Processar características para diferentes tipos de propriedade
    let characteristics = [];
    if (imovel.Caracteristicas) {
      characteristics = imovel.Caracteristicas.map(item => {
        const lowerName = item.Nome.toLowerCase();
        const icon = Object.entries(characteristicIcons).find(([key]) => 
          lowerName.includes(key)
        )?.[1] || <StarIcon />;
        
        return { ...item, icon };
      });
    }
    
    return {
      ...imovel,
      Id: imovel.Id,
      Titulo: imovel.Nome || imovel.Titulo || "Imóvel sem título",
      // Usar Valor se disponível (para lançamentos), senão ValorVenda
      ValorVenda: imovel.Valor || imovel.ValorVenda || 0,
      Dormitorios: imovel.Dormitorios || 0,
      Banheiros: imovel.WC || imovel.Banheiros || 0,
      Vagas: imovel.Vagas || 0,
      AreaTotal: imovel.AreaTotal || 0,
      AreaUtil: imovel.AreaUtil || 0,
      Bairro: imovel.Bairro || "",
      Cidade: imovel.Cidade || "",
      Logradouro: imovel.Logradouro || "",
      Numero: imovel.Numero || "",
      UF: imovel.UF || "",
      Fotos: imovel.Fotos || [],
      Plantas: imovel.Plantas || [],
      Caracteristicas: characteristics,
      Disponibilidade: imovel.Disponibilidade || "Disponível",
      Tipo: imovel.Tipo || (imovel.Categoria ? imovel.Categoria.Nome : "Não informado")
    };
  };

  const imovelNormalizado = normalizeImovelData(imovel);

  // Formatação de valores
  const formatCurrency = (value) => {
    if (!value || value <= 0) return null;
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
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

  // Handlers
  const handleContatoClick = () => {
    navigate("/contato", {
      state: {
        imovelId: imovelNormalizado?.Id,
        titulo: imovelNormalizado?.Titulo,
        valor: imovelNormalizado?.ValorVenda,
        bairro: imovelNormalizado?.Bairro
      }
    });
  };

  const handleAbrirAgendamento = () => {
    setOpenAgendamento(true);
    setEtapaAgendamento("selecao");
    setDataVisita(new Date()); // Inicializa com data atual
    setHoraVisita("");
    setAgendamentoError(null);
  };

  const handleFecharAgendamento = () => {
    setOpenAgendamento(false);
  };

  const handleProximoAgendamento = () => {
    if (!dataVisita || !horaVisita) {
      setAgendamentoError("Selecione uma data e horário");
      return;
    }
    setAgendamentoError(null);
    setEtapaAgendamento("confirmacao");
  };

  const handleConfirmarAgendamento = () => {
    const agendamentoData = {
      imovel_id: imovelNormalizado.Id,
      titulo: imovelNormalizado.Titulo,
      valor: imovelNormalizado.ValorVenda,
      bairro: imovelNormalizado.Bairro,
      cidade: imovelNormalizado.Cidade,
      logradouro: imovelNormalizado.Logradouro,
      data_visita: dataVisita.toISOString().split('T')[0], // Formato ISO (YYYY-MM-DD)
      hora_visita: horaVisita.replace(':', ''),
      data_formatada: format(dataVisita, "dd/MM/yyyy", { locale: ptBR }), // Formato DD/MM/YYYY
      hora_formatada: horaVisita
    };
  
    navigate("/agendamentos", { state: agendamentoData });
  };

  // Handler para mudança de data com tratamento especial
  const handleDateChange = (newValue) => {
    if (newValue) {
      const stabilizedDate = new Date(newValue);
      stabilizedDate.setHours(0, 0, 0, 0);
      setDataVisita(stabilizedDate);
    } else {
      setDataVisita(null);
    }
  };

  const handleImageLoad = (id) => {
    setLoadingImages(prev => ({ ...prev, [id]: false }));
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Componente de seleção de horário
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

  // Componente de Modal de Agendamento com as correções
  const ModalAgendamento = React.memo(() => (
    <Dialog 
      open={openAgendamento} 
      onClose={handleFecharAgendamento} 
      maxWidth="sm" 
      fullWidth
      TransitionComponent={Fade}
      transitionDuration={300}
      disableRestoreFocus={true} // Impede a restauração automática de foco
    >
      <DialogTitle sx={{ pb: 2 }}>
        <Typography variant="h6">
          {etapaAgendamento === "selecao" ? "Agendar Visita" : "Confirmar Agendamento"}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          {imovelNormalizado?.Titulo}
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <LocalizationProvider 
          dateAdapter={AdapterDateFns} 
          adapterLocale={ptBR}
          dateFormats={{ keyboardDate: 'dd/MM/yyyy' }} // Formato explícito para entrada de teclado
        >
          {etapaAgendamento === "selecao" ? (
            <Box sx={{ mt: 2 }}>
              {agendamentoError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {agendamentoError}
                </Alert>
              )}
              
              {/* DatePicker com todas as correções aplicadas */}
              <DatePicker
                label="Data da visita"
                value={dataVisita}
                onChange={handleDateChange}
                minDate={new Date()}
                inputFormat="dd/MM/yyyy"
                shouldDisableDate={(date) => date.getDay() === 0 || date.getDay() === 6}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    fullWidth 
                    sx={{ mb: 2 }} 
                    helperText="Apenas dias úteis"
                    onKeyDown={(e) => e.preventDefault()} // Previne entrada direta por teclado
                  />
                )}
                disablePast
                disableToolbar={false}
                PopperProps={{
                  placement: 'bottom-start', // Posicionamento mais estável
                  disablePortal: true, // Melhora o gerenciamento de foco
                }}
                OpenPickerButtonProps={{
                  'aria-label': 'Abrir calendário',
                }}
              />
              
              <HorarioPicker />
              
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'flex-end', 
                gap: 2, 
                pt: 3, 
                mt: 2, 
                borderTop: 1, 
                borderColor: 'divider' 
              }}>
                <Button 
                  variant="outlined" 
                  onClick={handleFecharAgendamento}
                >
                  Cancelar
                </Button>
                <Button 
                  variant="contained" 
                  onClick={handleProximoAgendamento}
                >
                  Continuar
                </Button>
              </Box>
            </Box>
          ) : (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Confirmação de Agendamento
              </Typography>
              
              <Box sx={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.04)', 
                p: 3, 
                borderRadius: 1,
                mb: 3
              }}>
                <Typography><strong>Imóvel:</strong> {imovelNormalizado?.Titulo}</Typography>
                <Typography><strong>Endereço:</strong> {imovelNormalizado?.Bairro}, {imovelNormalizado?.Cidade}</Typography>
                <Typography><strong>Valor:</strong> {formatCurrency(imovelNormalizado?.ValorVenda) || "Não informado"}</Typography>
                <Typography><strong>Data:</strong> {formatDate(dataVisita)}</Typography>
                <Typography><strong>Horário:</strong> {horaVisita}</Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Um corretor entrará em contato para confirmar os detalhes.
              </Typography>
              
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                gap: 2, 
                pt: 2, 
                borderTop: 1, 
                borderColor: 'divider' 
              }}>
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
  ));

  // Estados de loading/error
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => navigate(-1)}>
          Voltar
        </Button>
      </Container>
    );
  }

  if (!imovelNormalizado) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Imóvel não encontrado
        </Typography>
        <Button variant="contained" onClick={() => navigate(-1)}>
          Voltar
        </Button>
      </Container>
    );
  }

  const enderecoCompleto = `${imovelNormalizado.Logradouro || ""}${imovelNormalizado.Numero ? `, ${imovelNormalizado.Numero}` : ""} - ${imovelNormalizado.Bairro || ""}, ${imovelNormalizado.Cidade || ""} - ${imovelNormalizado.UF || ""}`;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <AnimatedSection animation="fade-up" delay="100">
        {/* Botão Voltar */}
        <Button 
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Voltar
        </Button>

        {/* Título */}
        <Typography variant="h4" component="h1" gutterBottom>
          {imovelNormalizado.Titulo}
        </Typography>
        <Divider sx={{ mb: 4 }} />

        {/* Carrossel de Fotos */}
        {(imovelNormalizado.Fotos.length > 0 || imovelNormalizado.Plantas.length > 0) ? (
          <Box sx={{ mb: 4, position: 'relative', borderRadius: 2, overflow: 'hidden', boxShadow: 3 }}>
            {/* Tabs para fotos e plantas */}
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
              sx={{ 
                backgroundColor: 'background.paper',
                borderBottom: 1,
                borderColor: 'divider'
              }}
            >
              <Tab 
                value="fotos" 
                label="Fotos" 
                disabled={imovelNormalizado.Fotos.length === 0}
              />
              <Tab 
                value="plantas" 
                label="Plantas" 
                disabled={imovelNormalizado.Plantas.length === 0}
              />
            </Tabs>
            
            <Slider {...settingsFotos}>
              {mediaToShow.map((media) => (
                <Box 
                  key={media.Id} 
                  sx={{ 
                    height: '500px',
                    position: 'relative'
                  }}
                >
                  <CardMedia
                    component="img"
                    image={media.Url}
                    alt={media.Descricao || (activeTab === 'fotos' ? "Foto do imóvel" : "Planta do imóvel")}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      backgroundColor: 'rgba(0,0,0,0.05)',
                      opacity: loadingImages[media.Id] === false ? 1 : 0,
                      transition: 'opacity 0.3s ease'
                    }}
                    onLoad={() => handleImageLoad(media.Id)}
                    onError={() => handleImageLoad(media.Id)}
                  />
                  {loadingImages[media.Id] !== false && (
                    <Box sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(0,0,0,0.05)'
                    }}>
                      <CircularProgress size={60} />
                    </Box>
                  )}
                </Box>
              ))}
            </Slider>
            
            {/* Contador de fotos */}
            <Box sx={{
              position: 'absolute',
              bottom: 16,
              right: 16,
              backgroundColor: 'rgba(0,0,0,0.6)',
              color: '#fff',
              px: 1.5,
              py: 0.5,
              borderRadius: 4,
              zIndex: 2
            }}>
              <Typography variant="body2">
                {currentSlide + 1} / {mediaToShow.length}
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box sx={{ 
            height: '300px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.05)',
            borderRadius: 2,
            mb: 4
          }}>
            <Typography variant="h6">Nenhuma mídia disponível</Typography>
          </Box>
        )}

        <Grid container spacing={4}>
          {/* Conteúdo Principal */}
          <Grid item xs={12} md={8}>
            <Card sx={{ mb: 4 }}>
              <CardContent>
                {/* Descrição */}
                {imovelNormalizado.Descricao && (
                  <>
                    <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
                      Descrição
                    </Typography>
                    <Typography paragraph>
                      {imovelNormalizado.Descricao}
                    </Typography>
                    <Divider sx={{ my: 3 }} />
                  </>
                )}

                {/* Características Principais */}
                <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
                  Características
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                  {imovelNormalizado.Dormitorios > 0 && (
                    <Chip icon={<BedIcon />} label={`${imovelNormalizado.Dormitorios} Dormitório${imovelNormalizado.Dormitorios > 1 ? 's' : ''}`} />
                  )}
                  {imovelNormalizado.Banheiros > 0 && (
                    <Chip icon={<BathtubIcon />} label={`${imovelNormalizado.Banheiros} Banheiro${imovelNormalizado.Banheiros > 1 ? 's' : ''}`} />
                  )}
                  {imovelNormalizado.Vagas > 0 && (
                    <Chip icon={<CarIcon />} label={`${imovelNormalizado.Vagas} Vaga${imovelNormalizado.Vagas > 1 ? 's' : ''}`} />
                  )}
                  {imovelNormalizado.AreaTotal > 0 && (
                    <Chip icon={<AreaIcon />} label={`${imovelNormalizado.AreaTotal}m² Área Total`} />
                  )}
                  {imovelNormalizado.AreaUtil > 0 && (
                    <Chip icon={<AreaIcon />} label={`${imovelNormalizado.AreaUtil}m² Área Útil`} />
                  )}
                </Box>

                {/* Detalhes Adicionais */}
                <Accordion sx={{ mb: 2 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">Detalhes Técnicos</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Stack spacing={1}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <HomeIcon color="primary" sx={{ mr: 1 }} />
                            <Typography><strong>Tipo:</strong> {imovelNormalizado.Tipo}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <LocationIcon color="primary" sx={{ mr: 1 }} />
                            <Typography><strong>Bairro:</strong> {imovelNormalizado.Bairro || "Não informado"}</Typography>
                          </Box>
                          {formatCurrency(imovelNormalizado.ValorVenda) && (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <PriceIcon color="primary" sx={{ mr: 1 }} />
                              <Typography><strong>Valor:</strong> {formatCurrency(imovelNormalizado.ValorVenda)}</Typography>
                            </Box>
                          )}
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Stack spacing={1}>
                          {imovelNormalizado.ValorCondominio > 0 && (
                            <Typography><strong>Condomínio:</strong> {formatCurrency(imovelNormalizado.ValorCondominio)}</Typography>
                          )}
                          {imovelNormalizado.ValorIPTU > 0 && (
                            <Typography><strong>IPTU:</strong> {formatCurrency(imovelNormalizado.ValorIPTU)}</Typography>
                          )}
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <StarIcon color="primary" sx={{ mr: 1 }} />
                            <Typography><strong>Status:</strong> {imovelNormalizado.Disponibilidade}</Typography>
                          </Box>
                        </Stack>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>

                {/* Descrição Detalhada */}
                {imovelNormalizado.DescricaoDetalhada && (
                  <Accordion sx={{ mb: 2 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="h6">Descrição Detalhada</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography whiteSpace="pre-line">
                        {imovelNormalizado.DescricaoDetalhada}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                )}

                {/* Características */}
                {imovelNormalizado.Caracteristicas.length > 0 && (
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="h6">Itens do Imóvel</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {imovelNormalizado.Caracteristicas.map((item, index) => (
                          <Chip 
                            key={index} 
                            icon={item.icon}
                            label={item.Nome} 
                            variant="outlined" 
                            sx={{ 
                              minWidth: '150px',
                              justifyContent: 'flex-start'
                            }}
                          />
                        ))}
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                )}
              </CardContent>
            </Card>

            {/* Mapa */}
            {(imovelNormalizado.Latitude && imovelNormalizado.Longitude) && (
              <Card>
                <CardContent>
                  <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
                    Localização
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <MapIcon color="primary" sx={{ mr: 1 }} />
                    <Typography><strong>Endereço:</strong> {enderecoCompleto}</Typography>
                  </Box>
                  <Map 
                    address={enderecoCompleto}
                    latitude={imovelNormalizado.Latitude} 
                    longitude={imovelNormalizado.Longitude}
                    height="400px"
                  />
                </CardContent>
              </Card>
            )}
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <Card sx={{ position: 'sticky', top: 20 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
                  Informações
                </Typography>
                <Divider sx={{ mb: 3 }} />

                {/* Preço - Mostrar apenas se houver valor */}
                {formatCurrency(imovelNormalizado.ValorVenda) && (
                  <Box sx={{ 
                    backgroundColor: 'primary.main', 
                    color: 'primary.contrastText', 
                    p: 2, 
                    borderRadius: 1,
                    mb: 3,
                    textAlign: 'center'
                  }}>
                    <Typography variant="h4">
                      {formatCurrency(imovelNormalizado.ValorVenda)}
                    </Typography>
                    <Typography variant="body2">
                      {imovelNormalizado.Disponibilidade}
                    </Typography>
                  </Box>
                )}

                {/* Detalhes Rápidos */}
                <Stack spacing={2} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography color="text.secondary">Tipo:</Typography>
                    <Typography>{imovelNormalizado.Tipo}</Typography>
                  </Box>
                  {imovelNormalizado.AreaTotal > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography color="text.secondary">Área Total:</Typography>
                      <Typography>{imovelNormalizado.AreaTotal}m²</Typography>
                    </Box>
                  )}
                  {imovelNormalizado.AreaUtil > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography color="text.secondary">Área Útil:</Typography>
                      <Typography>{imovelNormalizado.AreaUtil}m²</Typography>
                    </Box>
                  )}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography color="text.secondary">Dormitórios:</Typography>
                    <Typography>{imovelNormalizado.Dormitorios}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography color="text.secondary">Banheiros:</Typography>
                    <Typography>{imovelNormalizado.Banheiros}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography color="text.secondary">Vagas:</Typography>
                    <Typography>{imovelNormalizado.Vagas}</Typography>
                  </Box>
                </Stack>

                {/* Ações */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<PhoneIcon />}
                    onClick={handleContatoClick}
                    sx={{ py: 1.5 }}
                  >
                    Falar com Corretor
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<CalendarIcon />}
                    onClick={handleAbrirAgendamento}
                    sx={{ py: 1.5 }}
                  >
                    Agendar Visita
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Modal de Agendamento */}
        <ModalAgendamento />
      </AnimatedSection>
    </Container>
  );
};

export default DetailsImoveis;