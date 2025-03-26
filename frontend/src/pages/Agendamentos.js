import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Divider,
  Grid,
  Paper,
  Alert,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Fade,
  Slide,
  Snackbar,
  IconButton
} from "@mui/material";
import {
  CalendarToday as CalendarIcon,
  Schedule as TimeIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  Home as HomeIcon,
  LocationOn as LocationIcon,
  MonetizationOn as PriceIcon,
  ArrowBack as BackIcon,
  Close as CloseIcon,
  Celebration as CelebrationIcon
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

const Agendamentos = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;

  // Estados do formulário
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [dataVisita, setDataVisita] = useState(
    state?.data_visita ? parseISO(state.data_visita) : null
  );
  const [horaVisita, setHoraVisita] = useState(
    state?.hora_visita ? 
      (state.hora_visita.includes(':') ? state.hora_visita : 
       `${state.hora_visita.slice(0, 2)}:${state.hora_visita.slice(2)}`) : 
      ""
  );
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Horários disponíveis
  const horariosDisponiveis = [
    '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', 
    '17:00', '18:00'
  ];

  // Fechar o Snackbar
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  // Ação do Snackbar
  const action = (
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      onClick={handleCloseSnackbar}
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  );
  
  // Verificar se veio redirecionado com dados válidos
  useEffect(() => {
    if (!state) {
      setError("Nenhum imóvel selecionado. Redirecionando para a página inicial...");
      const timer = setTimeout(() => navigate("/"), 3000);
      return () => clearTimeout(timer);
    }
    // Trigger the form animation after component mounts
    const timer = setTimeout(() => setShowForm(true), 100);
    return () => clearTimeout(timer);
  }, [state, navigate]);

  // Formatadores
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value || 0);
  };

  const formatDateLong = (date) => {
    if (!date) return "";
    return format(date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  // Enviar agendamento
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validação dos campos
    if (!nome || !email || !telefone || !dataVisita || !horaVisita) {
      setError("Por favor, preencha todos os campos obrigatórios");
      setLoading(false);
      return;
    }

    try {
      const agendamentoData = {
        imovel_id: state?.imovel_id,
        titulo: state?.titulo,
        valor: state?.valor,
        bairro: state?.bairro,
        cidade: state?.cidade,
        nome,
        email,
        telefone,
        data_visita: format(dataVisita, "yyyy-MM-dd"),
        hora_visita: horaVisita,
      };

      const response = await fetch("http://127.0.0.1:8000/api/agendamentos/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(agendamentoData),
      });
      
      if (response.status === 201) {
        setSuccess(true);
        setOpenSnackbar(true);
        // Fechar o snackbar após 5 segundos
        setTimeout(() => {
          setOpenSnackbar(false);
          navigate("/"); // Redirecionar para home após o snackbar
        }, 5000);
      } else {
        throw new Error('Erro ao enviar agendamento');
      }
    } catch (err) {
      console.error('Erro ao enviar agendamento:', err);
      setError(err.response?.data?.message || 'Ocorreu um erro ao enviar seu agendamento. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Redirecionamento se não houver dados do imóvel
  if (error && !state) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => navigate("/")}
          startIcon={<BackIcon />}
        >
          Voltar à Página Inicial
        </Button>
      </Container>
    );
  }

  // Tela de sucesso após agendamento
  if (success) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Fade in={true} timeout={500}>
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
            <Box sx={{ mb: 3 }}>
              <CelebrationIcon color="success" sx={{ fontSize: 60 }} />
            </Box>
            <Typography variant="h4" component="h1" gutterBottom color="primary">
              Agendamento Confirmado com Sucesso!
            </Typography>
            <Typography variant="body1" gutterBottom>
              Parabéns! Seu agendamento foi confirmado e em breve um corretor entrará em contato para confirmar os detalhes.
            </Typography>
            <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
              Você será redirecionado automaticamente...
            </Typography>
          </Paper>
        </Fade>

        {/* Snackbar de confirmação */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={30000}
          onClose={handleCloseSnackbar}
          message="Agendamento realizado com sucesso!"
          action={action}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        />
      </Container>
    );
  }

  // Formulário de agendamento
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Button 
        startIcon={<BackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Voltar
      </Button>

      <Typography variant="h4" component="h1" gutterBottom align="center">
        Agendar Visita
      </Typography>
      <Divider sx={{ mb: 4 }} />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Slide direction="up" in={showForm} mountOnEnter unmountOnExit>
        <Paper elevation={3} sx={{ p: 4 }}>
          {/* Resumo do Imóvel */}
          {state && (
            <Box sx={{ 
              mb: 4, 
              p: 3, 
              backgroundColor: 'rgba(0, 0, 0, 0.04)', 
              borderRadius: 1 
            }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <HomeIcon color="primary" sx={{ mr: 1 }} /> Imóvel Selecionado
              </Typography>
              
              <Stack spacing={1.5}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <HomeIcon color="action" sx={{ mr: 1 }} />
                  <Typography variant="body1">
                    <strong>Título:</strong> {state.titulo}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationIcon color="action" sx={{ mr: 1 }} />
                  <Typography variant="body1">
                    <strong>Endereço:</strong> {state.bairro}, {state.cidade}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PriceIcon color="action" sx={{ mr: 1 }} />
                  <Typography variant="body1">
                    <strong>Valor:</strong> {formatCurrency(state.valor)}
                  </Typography>
                </Box>
                
                {state.data_visita && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarIcon color="action" sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      <strong>Data pré-selecionada:</strong> {formatDateLong(parseISO(state.data_visita))}
                    </Typography>
                  </Box>
                )}
                
                {state.hora_visita && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TimeIcon color="action" sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      <strong>Horário pré-selecionado:</strong> {horaVisita}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Box>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Nome */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nome Completo *"
                  variant="outlined"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  InputProps={{
                    startAdornment: <PersonIcon color="action" sx={{ mr: 1 }} />,
                  }}
                />
              </Grid>

              {/* Email */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email *"
                  variant="outlined"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  InputProps={{
                    startAdornment: <EmailIcon color="action" sx={{ mr: 1 }} />,
                  }}
                />
              </Grid>

              {/* Telefone */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Telefone *"
                  variant="outlined"
                  required
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  InputProps={{
                    startAdornment: <PhoneIcon color="action" sx={{ mr: 1 }} />,
                  }}
                />
              </Grid>

              {/* Data */}
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                    <DatePicker
                      label="Data da Visita *"
                      value={dataVisita}
                      onChange={(newValue) => setDataVisita(newValue)}
                      minDate={new Date()}
                      inputFormat="dd/MM/yyyy"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          required
                          InputProps={{
                            startAdornment: <CalendarIcon color="action" sx={{ mr: 1 }} />,
                            ...params.InputProps,
                          }}
                      />
                    )}
                    shouldDisableDate={(date) => date.getDay() === 0 || date.getDay() === 6}
                  />
                </LocalizationProvider>
              </Grid>

              {/* Horário */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Horário da Visita *</InputLabel>
                  <Select
                    value={horaVisita}
                    onChange={(e) => setHoraVisita(e.target.value)}
                    required
                    label="Horário da Visita *"
                  >
                    {horariosDisponiveis.map((horario) => (
                      <MenuItem key={horario} value={horario}>
                        {horario}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Botão de Envio */}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  disabled={loading || success}
                  sx={{ py: 1.5 }}
                >
                  {loading ? (
                    <>
                      <CircularProgress size={24} sx={{ mr: 1, color: 'inherit' }} />
                      Enviando...
                    </>
                  ) : (
                    'Confirmar Agendamento'
                  )}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Slide>

      {/* Snackbar de confirmação */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: '100%' }}
          icon={<CelebrationIcon fontSize="inherit" />}
        >
          Agendamento realizado com sucesso! Você será redirecionado em breve.
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Agendamentos;