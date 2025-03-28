import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  IconButton,
  TextField,
  Tooltip,
  useMediaQuery,
  useTheme,
  Container,
  AppBar,
  Toolbar,
  Grid,
  Skeleton,
} from "@mui/material";
import {
  FaWhatsapp,
  FaPhone,
  FaSun,
  FaMoon,
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaFlag,
  FaFlagUsa,
  FaFlagCheckered,
} from "react-icons/fa";
import { LanguageContext } from "../../context/LanguageContext";
import { ThemeContext } from "../../context/ThemeContext";
import AnimatedSection from "../../components/Animated/AnimatedSection";
import { NumericFormat } from "react-number-format";
import { motion } from "framer-motion";
import { useSigaviApi } from "../../services/api";

// Componente de botão animado
const AnimatedButton = motion(Button);
const AnimatedIconButton = motion(IconButton);

function Header() {
  const navigate = useNavigate();
  const { language, setLanguage } = useContext(LanguageContext);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { fetchLogo } = useSigaviApi();
  const [logoUrl, setLogoUrl] = useState("");
  const [loadingLogo, setLoadingLogo] = useState(true);

  // Função para formatar a URL da logo baseada no ambiente
  const formatLogoUrl = (url) => {
    if (!url) return "/default-logo.png";
    
    // Se a URL já for absoluta (começa com http), retorna como está
    if (url.startsWith('http')) {
      return url;
    }
    
    // Configurações de ambiente
    const isDevelopment = process.env.NODE_ENV === 'development';
    const backendUrl = isDevelopment 
      ? 'http://127.0.0.1:8000' 
      : process.env.REACT_APP_BACKEND_URL || '';
    
    // Remove barras duplicadas entre a URL base e o caminho
    return `${backendUrl}${url.startsWith('/') ? url : `/${url}`}`;
  };

  // Inicializa o Google Translate
  const initializeGoogleTranslate = (lang) => {
    if (!window.google || !window.google.translate) {
      console.warn("Google Translate widget not loaded.");
      return;
    }

    const googleTranslateElement = document.getElementById("google_translate_element");
    if (googleTranslateElement) {
      googleTranslateElement.innerHTML = "";
    }

    new window.google.translate.TranslateElement(
      {
        pageLanguage: "pt",
        includedLanguages: "pt,en,es",
        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
      },
      "google_translate_element"
    );

    const googleTranslateSelect = document.querySelector(".goog-te-combo");
    if (googleTranslateSelect) {
      googleTranslateSelect.value = language;
      googleTranslateSelect.dispatchEvent(new Event("change"));
    }
  };

  const changeLanguage = (language) => {
    setLanguage(language);
    setTimeout(() => {
      initializeGoogleTranslate(language);
    }, 500);
  };

  useEffect(() => {
    const loadLogo = async () => {
      try {
        setLoadingLogo(true);
        const logoData = await fetchLogo();
        if (logoData && logoData.logoUrl) {
          setLogoUrl(formatLogoUrl(logoData.logoUrl));
        }
      } catch (error) {
        console.error("Error loading logo:", error);
      } finally {
        setLoadingLogo(false);
      }
    };

    loadLogo();
  }, [fetchLogo]);

  const handleSearch = (query) => {
    navigate(`/search?q=${query}`);
  };

  const appRoutes = [
    { path: "/", name: "Home" },
    { path: "/sobre", name: "Sobre" },
    { path: "/contato", name: "Contato" },
    { path: "/todos-imoveis", name: "Todos os Imóveis" },
  ];

  // Variantes de animação
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
      rotateY: 180,
      scale: 1.1,
      transition: { duration: 0.5 }
    },
    tap: {
      scale: 0.9
    }
  };

  const socialIconVariants = {
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

  const flagVariants = {
    hover: {
      rotateY: 360,
      scale: 1.2,
      transition: { duration: 0.8 }
    },
    tap: {
      scale: 0.9
    }
  };

  return (
    <>
      <AnimatedSection animation="fade-down" delay="100">
        <AppBar
          position="static"
          sx={{
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
            boxShadow: "none",
            py: 1,
          }}
        >
          <Container maxWidth="lg">
            <Toolbar disableGutters>
              <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
                <Link to="/">
                  {loadingLogo ? (
                    <Skeleton 
                      variant="rectangular" 
                      width={isMobile ? 120 : 150} 
                      height={isMobile ? 40 : 50} 
                    />
                  ) : (
                    <motion.img
                      src={logoUrl || "/default-logo.png"}
                      alt="Logo da Empresa"
                      style={{ height: isMobile ? "40px" : "50px" }}
                      whileHover={{ rotate: [0, -5, 5, 0] }}
                      transition={{ duration: 0.5 }}
                    />
                  )}
                </Link>
              </Box>

              <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
                {appRoutes.map((route, index) => (
                  <AnimatedButton
                    key={index}
                    variant="text"
                    onClick={() => navigate(route.path)}
                    sx={{
                      color: theme.palette.text.primary,
                    }}
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    {route.name}
                  </AnimatedButton>
                ))}
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Tooltip title="Português">
                  <AnimatedIconButton 
                    onClick={() => changeLanguage("pt")}
                    variants={flagVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <FaFlag style={{ color: "#006600" }} />
                  </AnimatedIconButton>
                </Tooltip>
                <Tooltip title="Inglês">
                  <AnimatedIconButton 
                    onClick={() => changeLanguage("en")}
                    variants={flagVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <FaFlagUsa style={{ color: "#0000FF" }} />
                  </AnimatedIconButton>
                </Tooltip>
                <Tooltip title="Espanhol">
                  <AnimatedIconButton 
                    onClick={() => changeLanguage("es")}
                    variants={flagVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <FaFlagCheckered style={{ color: "#FF0000" }} />
                  </AnimatedIconButton>
                </Tooltip>

                <AnimatedIconButton
                  onClick={toggleTheme}
                  sx={{
                    color: theme.palette.text.primary,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                  variants={iconVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  {isDarkMode ? <FaSun /> : <FaMoon />}
                </AnimatedIconButton>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </AnimatedSection>

      <AnimatedSection animation="fade-up" delay="200">
        <Box
          sx={{
            backgroundColor: theme.palette.background.paper,
            py: 2,
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <motion.div whileHover={{ scale: 1.01 }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Buscar..."
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleSearch(e.target.value);
                      }
                    }}
                    sx={{
                      backgroundColor: theme.palette.background.paper,
                    }}
                  />
                </motion.div>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ display: "flex", gap: 2, justifyContent: { xs: "center", md: "flex-end" } }}>
                  <AnimatedButton
                    variant="outlined"
                    startIcon={<FaWhatsapp />}
                    sx={{
                      color: theme.palette.text.primary,
                      borderColor: theme.palette.divider,
                    }}
                    component="a"
                    href="https://wa.me/5511938020000"
                    target="_blank"
                    rel="noopener noreferrer"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <NumericFormat
                      value="11938020000"
                      displayType="text"
                      format="(##) #####-####"
                    />
                  </AnimatedButton>
                  <AnimatedButton
                    variant="outlined"
                    startIcon={<FaPhone />}
                    sx={{
                      color: theme.palette.text.primary,
                      borderColor: theme.palette.divider,
                    }}
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <NumericFormat
                      value="1138884500"
                      displayType="text"
                      format="(##) ####-####"
                    />
                  </AnimatedButton>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </AnimatedSection>

      <AnimatedSection animation="fade-up" delay="300">
        <Box
          sx={{
            backgroundColor: theme.palette.background.default,
            py: 2,
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
              <AnimatedIconButton 
                href="https://web.facebook.com/cmarqxsp/" 
                target="_blank" 
                sx={{ color: theme.palette.text.primary }}
                variants={socialIconVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <FaFacebook />
              </AnimatedIconButton>
              <AnimatedIconButton 
                href="https://www.instagram.com/cmarqximoveis/" 
                target="_blank" 
                sx={{ color: theme.palette.text.primary }}
                variants={socialIconVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <FaInstagram />
              </AnimatedIconButton>
              <AnimatedIconButton 
                href="https://www.youtube.com/@cmarqx" 
                target="_blank" 
                sx={{ color: theme.palette.text.primary }}
                variants={socialIconVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <FaYoutube />
              </AnimatedIconButton>
            </Box>
          </Container>
        </Box>
      </AnimatedSection>

      <div id="google_translate_element" style={{ display: "none" }}></div>
    </>
  );
}

export default Header;