import React, { useEffect, useState, useContext } from "react";
import { Box, Tooltip, keyframes } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { ThemeContext } from "../../context/ThemeContext"; // Importe o ThemeContext

const UpPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { isDarkMode } = useContext(ThemeContext); // Acesse o tema atual

  // Verifica a posição do scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight / 2) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Função para rolar a página para o topo
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Rola suavemente
    });
  };

  // Animação de fade-in
  const fadeIn = keyframes`
    0% { opacity: 0; transform: translateY(20px); }
    100% { opacity: 1; transform: translateY(0); }
  `;

  // Animação de pulso
  const pulse = keyframes`
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  `;

  // Cores dinâmicas com base no tema
  const colors = {
    background: isDarkMode ? "#333" : "#1976d2", // Fundo do botão
    icon: isDarkMode ? "#fff" : "#fff", // Cor do ícone
    tooltipBackground: isDarkMode ? "#424242" : "#1976d2", // Fundo do tooltip
    tooltipText: isDarkMode ? "#fff" : "#fff", // Texto do tooltip
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: "20px",
        left: "20px", // Posiciona no canto esquerdo
        zIndex: 1000,
        opacity: isVisible ? 1 : 0, // Controla a visibilidade
        transition: "opacity 0.3s ease",
        animation: isVisible ? `${fadeIn} 0.5s ease-in-out` : "none", // Animação de fade-in
      }}
    >
      <Tooltip
        title="Voltar ao topo"
        placement="right"
        arrow
        componentsProps={{
          tooltip: {
            sx: {
              backgroundColor: colors.tooltipBackground, // Cor do tooltip
              color: colors.tooltipText, // Cor do texto
              fontSize: "0.9rem", // Tamanho da fonte
              fontWeight: "bold", // Fonte em negrito
            },
          },
          arrow: {
            sx: {
              color: colors.tooltipBackground, // Cor da seta do tooltip
            },
          },
        }}
      >
        <Box
          onClick={scrollToTop}
          sx={{
            backgroundColor: colors.background,
            borderRadius: "50%",
            width: "50px",
            height: "50px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
            cursor: "pointer",
            transition: "transform 0.3s ease",
            animation: `${pulse} 2s infinite`, // Animação de pulso
            "&:hover": {
              transform: "scale(1.1)", // Efeito de escala ao passar o mouse
            },
          }}
        >
          <KeyboardArrowUpIcon
            sx={{
              color: colors.icon,
              fontSize: "30px",
            }}
          />
        </Box>
      </Tooltip>
    </Box>
  );
};

export default UpPage;