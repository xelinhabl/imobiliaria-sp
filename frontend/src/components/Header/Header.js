import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
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
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { MdTranslate } from "react-icons/md";
import { LanguageContext } from "../../context/LanguageContext";
import { ThemeContext } from "../../context/ThemeContext"; // Importe o ThemeContext
import AnimatedSection from "../../components/Animated/AnimatedSection";
import { NumericFormat } from "react-number-format"; // Substituição do react-input-mask

function Header() {
  const navigate = useNavigate();
  const { language, toggleLanguage } = useContext(LanguageContext);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext); // Use o ThemeContext
  const theme = useTheme(); // Acessa o tema do Material-UI
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [logoUrl, setLogoUrl] = useState("");
  const [translations, setTranslations] = useState({});

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

    const fetchTranslations = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/translations/${language}/`);
        if (response.ok) {
          const data = await response.json();
          setTranslations(data.translations || {});
        } else {
          console.warn("Traduções não encontradas. Status:", response.status);
          setTranslations({});
        }
      } catch (error) {
        console.error("Erro ao buscar as traduções:", error.message);
        setTranslations({});
      }
    };

    fetchLogo();
    fetchTranslations();
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
            backgroundColor: theme.palette.background.default, // Cor de fundo do tema
            color: theme.palette.text.primary, // Cor do texto do tema
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
                      color: theme.palette.text.primary, // Cor do texto do tema
                      "&:hover": {
                        backgroundColor: theme.palette.action.hover, // Cor de hover do tema
                      },
                    }}
                  >
                    {route.name}
                  </Button>
                ))}
              </Box>

              {/* Contatos e ícones */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Tooltip title={`Alterar idioma para ${language === "pt" ? "Inglês" : language === "en" ? "Espanhol" : "Português"}`}>
                  <IconButton
                    onClick={toggleLanguage}
                    sx={{
                      color: theme.palette.text.primary, // Cor do texto do tema
                      border: `1px solid ${theme.palette.divider}`, // Cor da borda do tema
                    }}
                  >
                    <MdTranslate />
                    <Typography variant="body1" sx={{ ml: 1 }}>
                      {language.toUpperCase()}
                    </Typography>
                  </IconButton>
                </Tooltip>

                {/* Botão para alternar o tema */}
                <IconButton
                  onClick={toggleTheme} // Use a função toggleTheme do ThemeContext
                  sx={{
                    color: theme.palette.text.primary, // Cor do texto do tema
                    border: `1px solid ${theme.palette.divider}`, // Cor da borda do tema
                  }}
                >
                  {isDarkMode ? <FaSun /> : <FaMoon />} {/* Use isDarkMode para alternar o ícone */}
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
            backgroundColor: theme.palette.background.paper, // Cor de fundo do tema
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
                  placeholder={translations.searchPlaceholder || "Buscar..."}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSearch(e.target.value);
                    }
                  }}
                  sx={{
                    backgroundColor: theme.palette.background.paper, // Cor de fundo do tema
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
                      color: theme.palette.text.primary, // Cor do texto do tema
                      borderColor: theme.palette.divider, // Cor da borda do tema
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
                      color: theme.palette.text.primary, // Cor do texto do tema
                      borderColor: theme.palette.divider, // Cor da borda do tema
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
            backgroundColor: theme.palette.background.default, // Cor de fundo do tema
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
              <IconButton href="https://twitter.com" target="_blank" sx={{ color: theme.palette.text.primary }}>
                <FaTwitter />
              </IconButton>
              <IconButton href="https://youtube.com" target="_blank" sx={{ color: theme.palette.text.primary }}>
                <FaYoutube />
              </IconButton>
            </Box>
          </Container>
        </Box>
      </AnimatedSection>
    </>
  );
}

export default Header;