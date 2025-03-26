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
} from "@mui/material";
import {
  FaWhatsapp,
  FaPhone,
  FaSun,
  FaMoon,
  FaFacebook,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";
import { FaFlag, FaFlagUsa, FaFlagCheckered } from "react-icons/fa"; // Importando ícones de bandeiras
import { LanguageContext } from "../../context/LanguageContext";
import { ThemeContext } from "../../context/ThemeContext";
import AnimatedSection from "../../components/Animated/AnimatedSection";
import { NumericFormat } from "react-number-format";

function Header() {
  const navigate = useNavigate();
  const { language, setLanguage } = useContext(LanguageContext);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [logoUrl, setLogoUrl] = useState("");

  // Função para reinicializar o widget do Google Translate
  const initializeGoogleTranslate = (lang) => {
    // Verifica se o widget do Google Translate está carregado
    if (!window.google || !window.google.translate) {
      console.warn("Google Translate widget not loaded.");
      return;
    }

    // Remove o widget existente
    const googleTranslateElement = document.getElementById("google_translate_element");
    if (googleTranslateElement) {
      googleTranslateElement.innerHTML = ""; // Limpa o conteúdo do elemento
    }

    // Recria o widget com o novo idioma
    new window.google.translate.TranslateElement(
      {
        pageLanguage: "pt",
        includedLanguages: "pt,en,es",
        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
      },
      "google_translate_element"
    );

    // Força a seleção do idioma
    const googleTranslateSelect = document.querySelector(".goog-te-combo");
    if (googleTranslateSelect) {
      googleTranslateSelect.value = lang;
      googleTranslateSelect.dispatchEvent(new Event("change"));
    }
  };

  // Função para mudar o idioma
  const changeLanguage = (lang) => {
    setLanguage(lang); // Atualiza o idioma no contexto

    // Aguarda um pequeno intervalo antes de reinicializar o widget
    setTimeout(() => {
      initializeGoogleTranslate(lang);
    }, 500); // 500ms de delay
  };

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/logo/");
        const data = await response.json();
        if (data.logoUrl) {
          const logoName = data.logoUrl.split("/logos/")[1];
          const baseUrl = "http://127.0.0.1:8000/media/logos/";
          setLogoUrl(`${baseUrl}${logoName}`);
        } else {
          setLogoUrl(null);
        }
      } catch (error) {
        console.error("Erro ao buscar a logo:", error);
        setLogoUrl(null);
      }
    };

    fetchLogo();
  }, [language]);

  const handleSearch = (query) => {
    navigate(`/search?q=${query}`);
  };

  const appRoutes = [
    { path: "/", name: "Home" },
    { path: "/sobre", name: "Sobre" },
    { path: "/contato", name: "Contato" },
    { path: "/todos-imoveis", name: "Todos os Imóveis" },
  ];

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
              {/* Logotipo */}
              <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
                <Link to="/">
                  <img
                    src={logoUrl || undefined}
                    alt="Logo da Empresa"
                    style={{ height: isMobile ? "40px" : "50px" }}
                  />
                </Link>
              </Box>

              {/* Links de navegação */}
              <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
                {appRoutes.map((route, index) => (
                  <Button
                    key={index}
                    variant="text"
                    onClick={() => navigate(route.path)}
                    sx={{
                      color: theme.palette.text.primary,
                      "&:hover": {
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                  >
                    {route.name}
                  </Button>
                ))}
              </Box>

              {/* Contatos e ícones */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                {/* Bandeirinhas para seleção de idioma */}
                <Tooltip title="Português">
                  <IconButton onClick={() => changeLanguage("pt")}>
                    <FaFlag style={{ color: "#006600" }} /> {/* Bandeira do Brasil */}
                  </IconButton>
                </Tooltip>
                <Tooltip title="Inglês">
                  <IconButton onClick={() => changeLanguage("en")}>
                    <FaFlagUsa style={{ color: "#0000FF" }} /> {/* Bandeira dos EUA */}
                  </IconButton>
                </Tooltip>
                <Tooltip title="Espanhol">
                  <IconButton onClick={() => changeLanguage("es")}>
                    <FaFlagCheckered style={{ color: "#FF0000" }} /> {/* Bandeira da Espanha */}
                  </IconButton>
                </Tooltip>

                {/* Botão para alternar o tema */}
                <IconButton
                  onClick={toggleTheme}
                  sx={{
                    color: theme.palette.text.primary,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  {isDarkMode ? <FaSun /> : <FaMoon />}
                </IconButton>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </AnimatedSection>

      {/* Barra de busca e contatos */}
      <AnimatedSection animation="fade-up" delay="200">
        <Box
          sx={{
            backgroundColor: theme.palette.background.paper,
            py: 2,
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={2} alignItems="center">
              {/* Busca */}
              <Grid item xs={12} md={6}>
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
              </Grid>

              {/* Contatos */}
              <Grid item xs={12} md={6}>
                <Box sx={{ display: "flex", gap: 2, justifyContent: { xs: "center", md: "flex-end" } }}>
                  <Button
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
                  >
                    <NumericFormat
                      value="11938020000"
                      displayType="text"
                      format="(##) #####-####"
                    />
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<FaPhone />}
                    sx={{
                      color: theme.palette.text.primary,
                      borderColor: theme.palette.divider,
                    }}
                  >
                    <NumericFormat
                      value="1138884500"
                      displayType="text"
                      format="(##) ####-####"
                    />
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </AnimatedSection>

      {/* Redes sociais */}
      <AnimatedSection animation="fade-up" delay="300">
        <Box
          sx={{
            backgroundColor: theme.palette.background.default,
            py: 2,
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
              <IconButton href="https://facebook.com" target="_blank" sx={{ color: theme.palette.text.primary }}>
                <FaFacebook />
              </IconButton>
              <IconButton href="https://instagram.com" target="_blank" sx={{ color: theme.palette.text.primary }}>
                <FaInstagram />
              </IconButton>
              <IconButton href="https://youtube.com" target="_blank" sx={{ color: theme.palette.text.primary }}>
                <FaYoutube />
              </IconButton>
            </Box>
          </Container>
        </Box>
      </AnimatedSection>

      {/* Widget do Google Translate (oculto) */}
      <div id="google_translate_element" style={{ display: "none" }}></div>
    </>
  );
}

export default Header;