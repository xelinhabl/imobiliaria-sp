import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import MKBox from "../../components/MkBox/MKBox";
import DefaultNavbar from "../../components/NavsBars/DefaultNavbar";
import { FaWhatsapp, FaPhone, FaSun, FaMoon } from "react-icons/fa";
import { MdTranslate } from "react-icons/md";
import { Button, IconButton, TextField, Box, Typography, useMediaQuery, useTheme, Tooltip } from "@mui/material";
import { LanguageContext } from "../../context/LanguageContext"; // Importar o contexto
import "./Header.css";

function Header() {
  const navigate = useNavigate();
  const { language, toggleLanguage } = useContext(LanguageContext);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [logoUrl, setLogoUrl] = useState(""); // Inicializa sem caminho estático
  const [routes, setRoutes] = useState([]); // Rotas dinâmicas
  const [translations, setTranslations] = useState({}); // Textos traduzidos dinâmicos

  useEffect(() => {
    // Fetch da URL da logo do backend
    const fetchLogo = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/logo/");
        const data = await response.json();
        if (data.logoUrl) {
          const logoName = data.logoUrl.split("/logos/")[1]; // Extrai o nome do logo após "logos/"
          const baseUrl = "http://127.0.0.1:8000/media/logos/"; // Base URL para as imagens
          setLogoUrl(`${baseUrl}${logoName}`); // Define o caminho dinâmico da logo
        } else {
          setLogoUrl(null); // Define como null se não houver logo
        }
      } catch (error) {
        console.error("Erro ao buscar a logo:", error);
        setLogoUrl(null); // Define como null em caso de erro
      }
    };

    // Fetch das rotas do backend
    const fetchRoutes = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/routes/");
        if (response.ok) {
          const data = await response.json();
          setRoutes(data.routes || []);
        } else {
          console.warn("Rotas não encontradas. Status:", response.status);
          setRoutes([]); // Define como vazio em caso de erro
        }
      } catch (error) {
        console.error("Erro ao buscar as rotas:", error.message);
        setRoutes([]); // Define como vazio em caso de erro
      }
    };

    // Fetch dos textos traduzidos do backend
    const fetchTranslations = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/translations/${language}/`);
        if (response.ok) {
          const data = await response.json();
          setTranslations(data.translations || {});
        } else {
          console.warn("Traduções não encontradas. Status:", response.status);
          setTranslations({}); // Define como vazio em caso de erro
        }
      } catch (error) {
        console.error("Erro ao buscar as traduções:", error.message);
        setTranslations({}); // Define como vazio em caso de erro
      }
    };

    fetchLogo(); // Chama a função para buscar a logo
    fetchRoutes();
    fetchTranslations();
  }, [language]);

  // Verifica se a tela é pequena (mobile)
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Função para alternar o tema
  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  // Função para buscar imóveis
  const handleSearch = (query) => {
    navigate(`/search?q=${query}`);
  };

  const appRoutes = [
    { path: "/", name: "Home" },
    { path: "/sobre", name: "Sobre" },
    { path: "/contato", name: "Contato" },
  ];

  return (
    <>
      {/* Botões para rotas do App.js */}
      <Box sx={{ display: "flex", gap: "1rem", padding: "1rem", justifyContent: "center" }}>
        {appRoutes.map((route, index) => (
          <Button
            key={index}
            variant="contained"
            onClick={() => navigate(route.path)}
            sx={{
              backgroundColor: isDarkMode ? "#555" : "#007bff",
              color: "#fff",
              "&:hover": {
                backgroundColor: isDarkMode ? "#777" : "#0056b3",
              },
            }}
          >
            {route.name}
          </Button>
        ))}
      </Box>

      {/* Botões para novas rotas */}
      <Box sx={{ display: "flex", gap: "1rem", padding: "1rem", flexWrap: "wrap" }}>
        {routes.map((route, index) => (
          <Button
            key={index}
            variant="outlined"
            onClick={() => navigate(route.path)}
            sx={{
              color: isDarkMode ? "#fff" : "#333",
              borderColor: isDarkMode ? "#666" : "#ccc",
              "&:hover": {
                borderColor: isDarkMode ? "#888" : "#999",
                backgroundColor: isDarkMode ? "#444" : "#f5f5f5",
              },
            }}
          >
            {route.name}
          </Button>
        ))}
      </Box>

      {/* Resto do componente */}
      <MKBox variant="gradient" bgColor={isDarkMode ? "dark" : "light"} shadow="sm" py={0.25}>
        <DefaultNavbar
          routes={routes} // Rotas dinâmicas
          transparent
          relative
          light={!isDarkMode}
          center
        />

        {/* Cabeçalho personalizado */}
        <Box
          className={`header-container ${isDarkMode ? "dark-mode" : "light-mode"}`}
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row", // Coluna em mobile, linha em desktop
            alignItems: "center",
            justifyContent: "space-between",
            padding: isMobile ? "1rem" : "1rem 2rem", // Menor padding em mobile
            gap: isMobile ? "1rem" : "2rem", // Espaçamento menor em mobile
            backgroundColor: isDarkMode ? "#333" : "#fff",
            color: isDarkMode ? "#fff" : "#333",
            transition: "background-color 0.3s ease, color 0.3s ease",
          }}
        >
          {/* Logos */}
          <Box className="logo-container">
            <Link to="/">
              <img
                src={logoUrl || undefined} // Renderiza apenas se logoUrl não for null
                alt="Logo da Empresa"
                className="logo"
                style={{ height: isMobile ? "40px" : "50px", transition: "transform 0.3s ease" }}
              />
            </Link>
          </Box>

          {/* Busca inteligente */}
          <Box sx={{ flex: 1, width: isMobile ? "100%" : "auto" }}>
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
                backgroundColor: isDarkMode ? "#444" : "#f5f5f5",
                borderRadius: "4px",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: isDarkMode ? "#666" : "#ccc",
                  },
                  "&:hover fieldset": {
                    borderColor: isDarkMode ? "#888" : "#999",
                  },
                },
              }}
            />
          </Box>

          {/* Contatos */}
          <Box sx={{ display: "flex", gap: isMobile ? "1rem" : "2rem", flexWrap: "wrap" }}>
            <Button
              variant="outlined"
              startIcon={<FaWhatsapp />}
              sx={{
                color: isDarkMode ? "#fff" : "#333",
                borderColor: isDarkMode ? "#666" : "#ccc",
                "&:hover": {
                  borderColor: isDarkMode ? "#888" : "#999",
                  backgroundColor: isDarkMode ? "#444" : "#f5f5f5",
                },
              }}
            >
              (47) 99999-9999
            </Button>
            <Button
              variant="outlined"
              startIcon={<FaPhone />}
              sx={{
                color: isDarkMode ? "#fff" : "#333",
                borderColor: isDarkMode ? "#666" : "#ccc",
                "&:hover": {
                  borderColor: isDarkMode ? "#888" : "#999",
                  backgroundColor: isDarkMode ? "#444" : "#f5f5f5",
                },
              }}
            >
              (47) 3333-3333
            </Button>
          </Box>

          {/* Tradutor e Tema */}
          <Box sx={{ display: "flex", gap: isMobile ? "1rem" : "2rem", alignItems: "center" }}>
            <Tooltip title={`Alterar idioma para ${language === "pt" ? "Inglês" : language === "en" ? "Espanhol" : "Português"}`}>
              <IconButton
                onClick={toggleLanguage}
                sx={{
                  color: isDarkMode ? "#fff" : "#333",
                  border: `1px solid ${isDarkMode ? "#666" : "#ccc"}`,
                  borderRadius: "4px",
                  padding: "8px",
                  "&:hover": {
                    backgroundColor: isDarkMode ? "#444" : "#f5f5f5",
                  },
                }}
              >
                <MdTranslate />
                <Typography variant="body1" sx={{ marginLeft: "8px", fontSize: isMobile ? "0.875rem" : "1rem" }}>
                  {language.toUpperCase()}
                </Typography>
              </IconButton>
            </Tooltip>

            <IconButton
              onClick={toggleTheme}
              sx={{
                color: isDarkMode ? "#fff" : "#333",
                border: `1px solid ${isDarkMode ? "#666" : "#ccc"}`,
                borderRadius: "4px",
                padding: "8px",
                "&:hover": {
                  backgroundColor: isDarkMode ? "#444" : "#f5f5f5",
                },
              }}
            >
              {isDarkMode ? <FaSun /> : <FaMoon />}
            </IconButton>
          </Box>

          {/* CRECI e Horário */}
          <Box sx={{ textAlign: isMobile ? "center" : "right" }}>
            <Typography variant="body2" sx={{ margin: 0, cursor: "pointer", fontSize: isMobile ? "0.875rem" : "1rem" }}>
              {translations.creci || "CRECI: 15871J"}
            </Typography>
            <Typography variant="body2" sx={{ margin: 0, cursor: "pointer", fontSize: isMobile ? "0.875rem" : "1rem" }}>
              {translations.hours || "Horário de atendimento: 09:00 - 18:00"}
            </Typography>
          </Box>
        </Box>

        {/* Botões das rotas dinâmicas */}
        <Box sx={{ display: "flex", gap: isMobile ? "0.5rem" : "1rem", flexWrap: "wrap" }}>
          {routes.map((route, index) => (
            <Button
              key={index}
              variant="contained"
              onClick={() => navigate(route.path)}
              sx={{
                backgroundColor: isDarkMode ? "#555" : "#007bff",
                color: "#fff",
                "&:hover": {
                  backgroundColor: isDarkMode ? "#777" : "#0056b3",
                },
              }}
            >
              {route.name}
            </Button>
          ))}
        </Box>
      </MKBox>
    </>
  );
}

export default Header;