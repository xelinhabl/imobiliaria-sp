import React, { useState, useEffect, useContext } from 'react';
import { 
    Container, Grid, Typography, Link, TextField, Button, IconButton, Box, useTheme, Paper, Snackbar 
} from '@mui/material';
import MuiAlert from '@mui/material/Alert'; // Componente Alert para o Snackbar
import { Facebook, Twitter, LinkedIn, YouTube, Pinterest, Instagram, Phone, WhatsApp } from '@mui/icons-material';
import { LanguageContext } from '../../context/LanguageContext'; // Contexto de idioma
import { ThemeContext } from '../../context/ThemeContext'; // Contexto de tema
import AnimatedSection from '../Animated/AnimatedSection'; // Componente de seção animada
import { mask, unMask } from 'remask'; // Biblioteca para máscaras

// Componente Alert personalizado para o Snackbar
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Footer = () => {
    const [logoUrl, setLogoUrl] = useState("");
    const [email, setEmail] = useState(""); // Estado para o email da newsletter
    const [callRequest, setCallRequest] = useState({ name: '', email: '', phone: '' }); // Estado para o formulário "Ligamos para você"
    const [openSnackbar, setOpenSnackbar] = useState(false); // Estado para controlar o Snackbar
    const [snackbarMessage, setSnackbarMessage] = useState(""); // Mensagem do Snackbar
    const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Severidade do Snackbar (success, error, etc.)
    const theme = useTheme(); // Acessa o tema atual (dark/light mode)
    const { language } = useContext(LanguageContext); // Acessa o idioma atual
    const { isDarkMode } = useContext(ThemeContext); // Acessa o modo dark/light

    // Textos traduzidos
    const translations = {
        pt: {
            rights: "Todos os direitos reservados.",
            company: "Cmarqx Imobiliária",
            contact: "Contato",
            openingHours: "Horário de Atendimento",
            weekHours: "Segunda a Sexta: 9h às 18h",
            saturdayHours: "Sábado: 9h às 12h",
            socialMedia: "Redes Sociais",
            newsletter: "Newsletter",
            location: "Localização",
            callUs: "Ligamos para você",
            clientArea: "Central do Cliente",
            accessSystem: "Acessar Sistema",
            newsletterSuccess: "Inscrição realizada com sucesso!",
            newsletterError: "Erro ao realizar a inscrição.",
            callRequestSuccess: "Solicitação enviada com sucesso!",
            callRequestError: "Erro ao enviar a solicitação.",
        },
        en: {
            rights: "All rights reserved.",
            company: "Cmarqx Real Estate",
            contact: "Contact",
            openingHours: "Opening Hours",
            weekHours: "Monday to Friday: 9am to 6pm",
            saturdayHours: "Saturday: 9am to 12pm",
            socialMedia: "Social Media",
            newsletter: "Newsletter",
            location: "Location",
            callUs: "We Call You",
            clientArea: "Client Area",
            accessSystem: "Access System",
            newsletterSuccess: "Subscription successful!",
            newsletterError: "Error during subscription.",
            callRequestSuccess: "Request sent successfully!",
            callRequestError: "Error sending request.",
        },
        es: {
            rights: "Todos los derechos reservados.",
            company: "Cmarqx Inmobiliaria",
            contact: "Contacto",
            openingHours: "Horario de Atención",
            weekHours: "Lunes a Viernes: 9h a 18h",
            saturdayHours: "Sábado: 9h a 12h",
            socialMedia: "Redes Sociales",
            newsletter: "Boletín de Noticias",
            location: "Ubicación",
            callUs: "Te Llamamos",
            clientArea: "Área del Cliente",
            accessSystem: "Acceder al Sistema",
            newsletterSuccess: "¡Suscripción realizada con éxito!",
            newsletterError: "Error al realizar la suscripción.",
            callRequestSuccess: "¡Solicitud enviada con éxito!",
            callRequestError: "Error al enviar la solicitud.",
        },
    };

    // Função para fechar o Snackbar
    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    // Busca a logo da API
    useEffect(() => {
        const fetchLogo = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/api/logo/");
                const data = await response.json();
                if (data.logoUrl) {
                    const logoName = data.logoUrl.split("/logos/")[1];
                    const baseUrl = "http://127.0.0.1:8000/media/logos/";
                    setLogoUrl(`${baseUrl}${logoName}`);
                }
            } catch (error) {
                console.error("Erro ao buscar a logo:", error);
                setLogoUrl(""); // Fallback para evitar erros de renderização
            }
        };

        fetchLogo();
    }, []);

    // Função para lidar com a inscrição na newsletter
    const handleNewsletterSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:8000/api/newsletter/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
            if (response.ok) {
                setSnackbarMessage(translations[language].newsletterSuccess);
                setSnackbarSeverity("success");
                setOpenSnackbar(true);
                setEmail(""); // Limpa o campo de email após o sucesso
            } else {
                setSnackbarMessage(translations[language].newsletterError);
                setSnackbarSeverity("error");
                setOpenSnackbar(true);
            }
        } catch (error) {
            console.error("Erro ao enviar o email:", error);
        }
    };

    // Função para lidar com o envio do formulário "Ligamos para você"
    const handleCallRequestSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:8000/api/call-request/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(callRequest),
            });
            if (response.ok) {
                setSnackbarMessage(translations[language].callRequestSuccess);
                setSnackbarSeverity("success");
                setOpenSnackbar(true);
                setCallRequest({ name: '', email: '', phone: '' }); // Limpa os campos após o sucesso
            } else {
                setSnackbarMessage(translations[language].callRequestError);
                setSnackbarSeverity("error");
                setOpenSnackbar(true);
            }
        } catch (error) {
            console.error("Erro ao enviar a solicitação:", error);
        }
    };

    // Função para aplicar máscara no telefone
    const handlePhoneChange = (e) => {
        const unmaskedValue = unMask(e.target.value);
        const maskedValue = mask(unmaskedValue, ['(99) 99999-9999']);
        setCallRequest({ ...callRequest, phone: maskedValue });
    };

    return (
        <Paper
            component="footer"
            sx={{
                bgcolor: isDarkMode ? theme.palette.grey[900] : theme.palette.grey[100], // Fundo escuro ou claro
                color: isDarkMode ? theme.palette.common.white : theme.palette.text.primary, // Texto claro ou escuro
                py: 6,
                mt: 'auto',
                borderTop: `1px solid ${theme.palette.divider}`, // Borda no topo
            }}
        >
            <Container maxWidth="lg">
                {/* Primeira linha: 4 elementos */}
                <AnimatedSection animation="fade-up" delay="100">
                    <Grid container spacing={4} sx={{ marginBottom: 4 }}>
                        {/* Informações da empresa */}
                        <Grid item xs={12} sm={6} md={3} sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" gutterBottom>
                                {translations[language].company}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                                <Phone fontSize="small" />
                                <Typography variant="body1">
                                    (11) 3888-4500
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                                <Link href="https://wa.me/5511938020000" target="_blank" rel="noopener noreferrer" sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', color: 'inherit' }}>
                                    <WhatsApp fontSize="small" />
                                    <Typography variant="body1">
                                        (11) 93802-0000
                                    </Typography>
                                </Link>
                            </Box>
                            <Typography variant="body1">
                                Rua Gabriele D'Annunzio, 144 - Campo Belo - São Paulo
                            </Typography>
                            <Typography variant="body1">
                                CRECI: 15871J
                            </Typography>
                        </Grid>

                        {/* Horário de atendimento */}
                        <Grid item xs={12} sm={6} md={3} sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" gutterBottom>
                                {translations[language].openingHours}
                            </Typography>
                            <Typography variant="body1">
                                {translations[language].weekHours}
                            </Typography>
                            <Typography variant="body1">
                                {translations[language].saturdayHours}
                            </Typography>
                        </Grid>

                        {/* Links para redes sociais */}
                        <Grid item xs={12} sm={6} md={3} sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" gutterBottom>
                                {translations[language].socialMedia}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                                {[Facebook, Twitter, LinkedIn, YouTube, Pinterest, Instagram].map((Icon, index) => (
                                    <IconButton
                                        key={index}
                                        href="#"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        color="inherit"
                                        aria-label={Icon.name}
                                    >
                                        <Icon />
                                    </IconButton>
                                ))}
                            </Box>
                        </Grid>

                        {/* Cadastro de newsletter */}
                        <Grid item xs={12} sm={6} md={3} sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" gutterBottom>
                                {translations[language].newsletter}
                            </Typography>
                            <Box component="form" onSubmit={handleNewsletterSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
                                <TextField
                                    variant="outlined"
                                    placeholder="Seu e-mail"
                                    size="small"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    type="email"
                                    required
                                    sx={{ bgcolor: isDarkMode ? theme.palette.grey[800] : theme.palette.common.white, width: '100%' }}
                                />
                                <Button type="submit" variant="contained" color="primary">
                                    Assinar
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </AnimatedSection>

                {/* Segunda linha: 3 elementos */}
                <AnimatedSection animation="fade-up" delay="200">
                    <Grid container spacing={4} sx={{ marginBottom: 4 }}>
                        {/* Localização pelo Google Maps */}
                        <Grid item xs={12} sm={6} md={4} sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" gutterBottom>
                                {translations[language].location}
                            </Typography>
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3558.123456789012!2d-49.12345678901234!3d-26.123456789012345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDA3JzI0LjQiUyA0OcKwMDcnMjQuNCJX!5e0!3m2!1spt-BR!2sbr!4v1234567890123!5m2!1spt-BR!2sbr"
                                width="100%"
                                height="200"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                title="Localização no Google Maps"
                            ></iframe>
                        </Grid>

                        {/* Ligamos para você: formulário de contato */}
                        <Grid item xs={12} sm={6} md={4} sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" gutterBottom>
                                {translations[language].callUs}
                            </Typography>
                            <Box component="form" onSubmit={handleCallRequestSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
                                <TextField
                                    variant="outlined"
                                    placeholder="Nome"
                                    size="small"
                                    value={callRequest.name}
                                    onChange={(e) => setCallRequest({ ...callRequest, name: e.target.value })}
                                    required
                                    sx={{ bgcolor: isDarkMode ? theme.palette.grey[800] : theme.palette.common.white, width: '100%' }}
                                />
                                <TextField
                                    variant="outlined"
                                    placeholder="E-mail"
                                    size="small"
                                    value={callRequest.email}
                                    onChange={(e) => setCallRequest({ ...callRequest, email: e.target.value })}
                                    type="email"
                                    required
                                    sx={{ bgcolor: isDarkMode ? theme.palette.grey[800] : theme.palette.common.white, width: '100%' }}
                                />
                                <TextField
                                    variant="outlined"
                                    placeholder="Telefone"
                                    size="small"
                                    value={callRequest.phone}
                                    onChange={handlePhoneChange}
                                    required
                                    sx={{ bgcolor: isDarkMode ? theme.palette.grey[800] : theme.palette.common.white, width: '100%' }}
                                />
                                <Button type="submit" variant="contained" color="primary">
                                    Enviar
                                </Button>
                            </Box>
                        </Grid>

                        {/* Link para Acesso ao sistema do cliente */}
                        <Grid item xs={12} sm={6} md={4} sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" gutterBottom>
                                {translations[language].clientArea}
                            </Typography>
                            <Link target="_blank" href="https://cmarqx.sigavi360.com.br/" color={isDarkMode ? "secondary" : "primary"}>
                                {translations[language].accessSystem}
                            </Link>
                        </Grid>
                    </Grid>
                </AnimatedSection>

                {/* Terceira linha: 1 elemento (logo e direitos autorais) */}
                <AnimatedSection animation="fade-up" delay="300">
                    <Grid container spacing={4}>
                        <Grid item xs={12} sx={{ textAlign: 'center', mt: 4 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                <img src={logoUrl} alt="Logo da Imobiliária" style={{ maxWidth: '150px' }} />
                                <Typography variant="body1">
                                    &copy; 2025 Imobiliária Cmarqx. {translations[language].rights}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </AnimatedSection>
            </Container>

            {/* Snackbar para exibir mensagem de sucesso ou erro */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000} // Fecha automaticamente após 6 segundos
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} // Posição do Snackbar
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Paper>
    );
};

export default Footer;