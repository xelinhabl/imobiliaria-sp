import React, { useState, useEffect, useContext } from 'react';
import { 
    Container, Grid, Typography, Link, TextField, Button, IconButton, Box, useTheme, Paper, Snackbar 
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { Facebook, YouTube, Instagram, Phone, WhatsApp } from '@mui/icons-material';
import { LanguageContext } from '../../context/LanguageContext';
import { ThemeContext } from '../../context/ThemeContext';
import AnimatedSection from '../Animated/AnimatedSection';
import { mask, unMask } from 'remask';
import { useSigaviApi } from '../../services/api';
import { motion } from 'framer-motion';

// Componentes animados
const AnimatedButton = motion(Button);
const AnimatedIconButton = motion(IconButton);
const AnimatedBox = motion(Box);
const AnimatedTypography = motion(Typography);
const AnimatedPaper = motion(Paper);

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Footer = () => {
    const [logoUrl, setLogoUrl] = useState("");
    const [email, setEmail] = useState("");
    const [callRequest, setCallRequest] = useState({ 
        name: '', 
        email: '', 
        phone: '' 
    });
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const theme = useTheme();
    const { language } = useContext(LanguageContext);
    const { isDarkMode } = useContext(ThemeContext);
    const { fetchLogo, fetchNewsletter, fetchCallRequest } = useSigaviApi();

    // Variantes de animação
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5
            }
        }
    };

    const buttonVariants = {
        hover: {
            y: -3,
            scale: 1.05,
            boxShadow: "0px 5px 15px rgba(0,0,0,0.3)",
            transition: { duration: 0.3, type: "spring", stiffness: 300 }
        },
        tap: {
            scale: 0.95,
            boxShadow: "0px 2px 5px rgba(0,0,0,0.2)"
        }
    };

    const iconVariants = {
        hover: {
            y: -5,
            scale: 1.2,
            rotate: [0, 10, -10, 0],
            transition: { duration: 0.5 }
        },
        tap: {
            scale: 0.8
        }
    };

    const logoVariants = {
        hover: {
            rotate: [0, -5, 5, 0],
            transition: { duration: 0.5 }
        }
    };

    // Função para formatar a URL da logo baseada no ambiente
    const formatLogoUrl = (url) => {
        if (!url) return "/default-logo.png";
        
        if (url.startsWith('http')) {
            return url;
        }
        
        const isDevelopment = process.env.NODE_ENV === 'development';
        const backendUrl = isDevelopment 
            ? 'http://127.0.0.1:8000' 
            : process.env.REACT_APP_BACKEND_URL || '';
        
        return `${backendUrl}${url.startsWith('/') ? url : `/${url}`}`;
    };

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

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setOpenSnackbar(false);
    };

    // Busca a logo da API e formata a URL corretamente
    useEffect(() => {
        const loadLogo = async () => {
            try {
                const logoData = await fetchLogo();
                if (logoData && logoData.logoUrl) {
                    setLogoUrl(formatLogoUrl(logoData.logoUrl));
                }
            } catch (error) {
                console.error("Error loading logo:", error);
                setLogoUrl("/default-logo.png");
            }
        };

        loadLogo();
    }, [fetchLogo]);

    const handleNewsletterSubmit = async (e) => {
        e.preventDefault();
        try {
            // Validação básica do email no frontend
            if (!email || !email.includes('@') || !email.includes('.')) {
                setSnackbarMessage("Por favor, insira um email válido");
                setSnackbarSeverity("error");
                setOpenSnackbar(true);
                return;
            }
    
            const response = await fetchNewsletter(email);
            
            // Verifica se a resposta existe e tem status de sucesso
            if (response && (response.success || response.status === 200 || response.status === 201)) {
                setSnackbarMessage(translations[language].newsletterSuccess);
                setSnackbarSeverity("success");
                setEmail("");
            } else {
                // Se a resposta existe mas não tem sucesso
                setSnackbarMessage(response?.message || translations[language].newsletterError);
                setSnackbarSeverity("error");
            }
        } catch (error) {
            console.error("Error subscribing:", error);
            // Mostra mensagem mais detalhada do erro se disponível
            setSnackbarMessage(
                error.response?.data?.message || 
                error.message || 
                translations[language].newsletterError
            );
            setSnackbarSeverity("error");
        } finally {
            setOpenSnackbar(true);
        }
    };

    const handleCallRequestSubmit = async (e) => {
        e.preventDefault();
        try {
            // Validação básica dos campos
            if (!callRequest.name || !callRequest.email || !callRequest.phone) {
                setSnackbarMessage("Por favor, preencha todos os campos");
                setSnackbarSeverity("error");
                setOpenSnackbar(true);
                return;
            }

            const response = await fetchCallRequest(callRequest);
            
            if (response && (response.success || response.status === 200 || response.status === 201)) {
                setSnackbarMessage(translations[language].callRequestSuccess);
                setSnackbarSeverity("success");
                setCallRequest({ name: '', email: '', phone: '' });
            } else {
                setSnackbarMessage(response?.message || translations[language].callRequestError);
                setSnackbarSeverity("error");
            }
        } catch (error) {
            console.error("Error requesting call:", error);
            setSnackbarMessage(
                error.response?.data?.message || 
                error.message || 
                translations[language].callRequestError
            );
            setSnackbarSeverity("error");
        } finally {
            setOpenSnackbar(true);
        }
    };

    const handlePhoneChange = (e) => {
        const unmaskedValue = unMask(e.target.value);
        const maskedValue = mask(unmaskedValue, ['(99) 99999-9999']);
        setCallRequest({ ...callRequest, phone: maskedValue });
    };

    const handleSocialClick = (platform) => {
        console.log(`Social media click: ${platform}`);
    };

    return (
        <AnimatedPaper
            component="footer"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            sx={{
                bgcolor: isDarkMode ? theme.palette.grey[900] : theme.palette.grey[100],
                color: isDarkMode ? theme.palette.common.white : theme.palette.text.primary,
                py: 6,
                mt: 'auto',
                borderTop: `1px solid ${theme.palette.divider}`,
            }}
        >
            <Container maxWidth="lg">
                <AnimatedSection animation="fade-up" delay="100">
                    <Grid container spacing={4} sx={{ marginBottom: 4 }}>
                        {/* Company Info */}
                        <Grid item xs={12} sm={6} md={3} sx={{ textAlign: 'center' }}>
                            <AnimatedBox variants={itemVariants}>
                                <AnimatedTypography variant="h6" gutterBottom>
                                    {translations[language].company}
                                </AnimatedTypography>
                                <AnimatedBox 
                                    sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}
                                    variants={itemVariants}
                                >
                                    <Phone fontSize="small" />
                                    <Typography variant="body1">
                                        (11) 3888-4500
                                    </Typography>
                                </AnimatedBox>
                                <AnimatedBox 
                                    sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}
                                    variants={itemVariants}
                                >
                                    <Link 
                                        href="https://wa.me/5511938020000" 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: 1, 
                                            textDecoration: 'none', 
                                            color: 'inherit' 
                                        }}
                                        onClick={() => handleSocialClick('whatsapp')}
                                    >
                                        <WhatsApp fontSize="small" />
                                        <Typography variant="body1">
                                            (11) 93802-0000
                                        </Typography>
                                    </Link>
                                </AnimatedBox>
                                <AnimatedTypography variant="body1" variants={itemVariants}>
                                    Rua Gabriele D'Annunzio, 144 - Campo Belo - São Paulo
                                </AnimatedTypography>
                                <AnimatedTypography variant="body1" variants={itemVariants}>
                                    CRECI: 15871J
                                </AnimatedTypography>
                            </AnimatedBox>
                        </Grid>

                        {/* Opening Hours */}
                        <Grid item xs={12} sm={6} md={3} sx={{ textAlign: 'center' }}>
                            <AnimatedBox variants={itemVariants}>
                                <AnimatedTypography variant="h6" gutterBottom>
                                    {translations[language].openingHours}
                                </AnimatedTypography>
                                <AnimatedTypography variant="body1" variants={itemVariants}>
                                    {translations[language].weekHours}
                                </AnimatedTypography>
                                <AnimatedTypography variant="body1" variants={itemVariants}>
                                    {translations[language].saturdayHours}
                                </AnimatedTypography>
                            </AnimatedBox>
                        </Grid>

                        {/* Social Media */}
                        <Grid item xs={12} sm={6} md={3} sx={{ textAlign: 'center' }}>
                            <AnimatedBox variants={itemVariants}>
                                <AnimatedTypography variant="h6" gutterBottom>
                                    {translations[language].socialMedia}
                                </AnimatedTypography>
                                <AnimatedBox 
                                    sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}
                                    variants={itemVariants}
                                >
                                    <AnimatedIconButton
                                        href="https://web.facebook.com/cmarqxsp/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        color="inherit"
                                        aria-label="Facebook"
                                        onClick={() => handleSocialClick('facebook')}
                                        variants={iconVariants}
                                        whileHover="hover"
                                        whileTap="tap"
                                    >
                                        <Facebook />
                                    </AnimatedIconButton>
                                    <AnimatedIconButton
                                        href="https://www.youtube.com/@cmarqx"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        color="inherit"
                                        aria-label="YouTube"
                                        onClick={() => handleSocialClick('youtube')}
                                        variants={iconVariants}
                                        whileHover="hover"
                                        whileTap="tap"
                                    >
                                        <YouTube />
                                    </AnimatedIconButton>
                                    <AnimatedIconButton
                                        href="https://www.instagram.com/cmarqximoveis/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        color="inherit"
                                        aria-label="Instagram"
                                        onClick={() => handleSocialClick('instagram')}
                                        variants={iconVariants}
                                        whileHover="hover"
                                        whileTap="tap"
                                    >
                                        <Instagram />
                                    </AnimatedIconButton>
                                </AnimatedBox>
                            </AnimatedBox>
                        </Grid>

                        {/* Newsletter */}
                        <Grid item xs={12} sm={6} md={3} sx={{ textAlign: 'center' }}>
                            <AnimatedBox variants={itemVariants}>
                                <AnimatedTypography variant="h6" gutterBottom>
                                    {translations[language].newsletter}
                                </AnimatedTypography>
                                <AnimatedBox 
                                    component="form" 
                                    onSubmit={handleNewsletterSubmit} 
                                    sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}
                                    variants={itemVariants}
                                >
                                    <TextField
                                        variant="outlined"
                                        placeholder={language === 'en' ? "Your email" : language === 'es' ? "Tu correo" : "Seu e-mail"}
                                        size="small"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        type="email"
                                        required
                                        sx={{ bgcolor: isDarkMode ? theme.palette.grey[800] : theme.palette.common.white, width: '100%' }}
                                    />
                                    <AnimatedButton 
                                        type="submit" 
                                        variant="contained" 
                                        color="primary"
                                        variants={buttonVariants}
                                        whileHover="hover"
                                        whileTap="tap"
                                    >
                                        {language === 'en' ? "Subscribe" : language === 'es' ? "Suscribirse" : "Assinar"}
                                    </AnimatedButton>
                                </AnimatedBox>
                            </AnimatedBox>
                        </Grid>
                    </Grid>
                </AnimatedSection>

                <AnimatedSection animation="fade-up" delay="200">
                    <Grid container spacing={4} sx={{ marginBottom: 4 }}>
                        {/* Location */}
                        <Grid item xs={12} sm={6} md={4} sx={{ textAlign: 'center' }}>
                            <AnimatedBox variants={itemVariants}>
                                <AnimatedTypography variant="h6" gutterBottom>
                                    {translations[language].location}
                                </AnimatedTypography>
                                <motion.div whileHover={{ scale: 1.01 }}>
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.837837837838!2d-46.6863866844756!3d-23.54818418471338!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce57a7c7d6e2b7%3A0x1a3f5e5e5e5e5e5e!2sRua%20Gabriele%20D'Annunzio%2C%20144%20-%20Campo%20Belo%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2004602-000!5e0!3m2!1spt-BR!2sbr!4v1620000000000!5m2!1spt-BR!2sbr"
                                        width="100%"
                                        height="200"
                                        style={{ border: 0 }}
                                        allowFullScreen=""
                                        loading="lazy"
                                        title="Localização no Google Maps"
                                    />
                                </motion.div>
                            </AnimatedBox>
                        </Grid>

                        {/* Call Request */}
                        <Grid item xs={12} sm={6} md={4} sx={{ textAlign: 'center' }}>
                            <AnimatedBox variants={itemVariants}>
                                <AnimatedTypography variant="h6" gutterBottom>
                                    {translations[language].callUs}
                                </AnimatedTypography>
                                <AnimatedBox 
                                    component="form" 
                                    onSubmit={handleCallRequestSubmit} 
                                    sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}
                                    variants={itemVariants}
                                >
                                    <TextField
                                        variant="outlined"
                                        placeholder={language === 'en' ? "Name" : language === 'es' ? "Nombre" : "Nome"}
                                        size="small"
                                        value={callRequest.name}
                                        onChange={(e) => setCallRequest({ ...callRequest, name: e.target.value })}
                                        required
                                        sx={{ bgcolor: isDarkMode ? theme.palette.grey[800] : theme.palette.common.white, width: '100%' }}
                                    />
                                    <TextField
                                        variant="outlined"
                                        placeholder={language === 'en' ? "Email" : language === 'es' ? "Correo" : "E-mail"}
                                        size="small"
                                        value={callRequest.email}
                                        onChange={(e) => setCallRequest({ ...callRequest, email: e.target.value })}
                                        type="email"
                                        required
                                        sx={{ bgcolor: isDarkMode ? theme.palette.grey[800] : theme.palette.common.white, width: '100%' }}
                                    />
                                    <TextField
                                        variant="outlined"
                                        placeholder={language === 'en' ? "Phone" : language === 'es' ? "Teléfono" : "Telefone"}
                                        size="small"
                                        value={callRequest.phone}
                                        onChange={handlePhoneChange}
                                        required
                                        sx={{ bgcolor: isDarkMode ? theme.palette.grey[800] : theme.palette.common.white, width: '100%' }}
                                    />
                                    <AnimatedButton 
                                        type="submit" 
                                        variant="contained" 
                                        color="primary"
                                        variants={buttonVariants}
                                        whileHover="hover"
                                        whileTap="tap"
                                    >
                                        {language === 'en' ? "Send" : language === 'es' ? "Enviar" : "Enviar"}
                                    </AnimatedButton>
                                </AnimatedBox>
                            </AnimatedBox>
                        </Grid>

                        {/* Client Area */}
                        <Grid item xs={12} sm={6} md={4} sx={{ textAlign: 'center' }}>
                            <AnimatedBox variants={itemVariants}>
                                <AnimatedTypography variant="h6" gutterBottom>
                                    {translations[language].clientArea}
                                </AnimatedTypography>
                                <AnimatedBox variants={itemVariants}>
                                    <Link 
                                        target="_blank" 
                                        href="https://cmarqx.sigavi360.com.br/" 
                                        color={isDarkMode ? "secondary" : "primary"}
                                        onClick={() => handleSocialClick('client_area')}
                                        sx={{ 
                                            display: 'inline-block',
                                            transition: 'transform 0.3s ease',
                                            '&:hover': {
                                                transform: 'scale(1.05)'
                                            }
                                        }}
                                    >
                                        {translations[language].accessSystem}
                                    </Link>
                                </AnimatedBox>
                            </AnimatedBox>
                        </Grid>
                    </Grid>
                </AnimatedSection>

                <AnimatedSection animation="fade-up" delay="300">
                    <Grid container spacing={4}>
                        <Grid item xs={12} sx={{ textAlign: 'center', mt: 4 }}>
                            <AnimatedBox 
                                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}
                                variants={itemVariants}
                            >
                                {logoUrl && (
                                    <motion.img 
                                        src={logoUrl} 
                                        alt="Logo da Imobiliária" 
                                        style={{ 
                                            maxWidth: '150px', 
                                            height: 'auto',
                                        }}
                                        variants={logoVariants}
                                        whileHover="hover"
                                    />
                                )}
                                <AnimatedTypography variant="body1" variants={itemVariants}>
                                    &copy; {new Date().getFullYear()} Imobiliária Cmarqx. {translations[language].rights}
                                </AnimatedTypography>
                            </AnimatedBox>
                        </Grid>
                    </Grid>
                </AnimatedSection>
            </Container>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </AnimatedPaper>
    );
};

export default Footer;