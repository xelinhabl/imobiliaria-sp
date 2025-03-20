import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Box, Typography, Avatar, useTheme } from "@mui/material";

const CorretoresList = ({ corretores }) => {
  const theme = useTheme(); // Usando o tema do Material-UI

  // Função para formatar o nome
  const formatarNome = (nome) => {
    if (!nome) return ""; // Se o nome for vazio, retorna vazio

    // Remove a palavra "Corretor" (case insensitive)
    const nomeSemCorretor = nome.replace(/corretor/gi, "").trim();

    // Remove números e caracteres especiais
    const nomeSemNumerosESpeciais = nomeSemCorretor.replace(/[^a-zA-ZÀ-ú\s]/g, "");

    // Converte a primeira letra de cada palavra para maiúscula
    return nomeSemNumerosESpeciais
      .toLowerCase()
      .split(" ")
      .map((palavra) => palavra.charAt(0).toUpperCase() + palavra.slice(1))
      .join(" ");
  };

  // Função para validar e formatar o CRECI
  const validarEFormatarCreci = (creci) => {
    if (!creci) return null; // Se o CRECI for vazio, retorna null

    // Remove pontos do CRECI
    const creciSemPontos = creci.replace(/\./g, "");

    // Verifica se o CRECI contém apenas números
    const contemApenasNumeros = /^\d+$/.test(creciSemPontos);

    // Retorna o CRECI formatado ou null se contiver letras
    return contemApenasNumeros ? creciSemPontos : null;
  };

  // Configurações do carrossel
  const settings = {
    dots: true, // Mostra os pontos de navegação (bolinhas)
    infinite: true, // Loop infinito
    speed: 500, // Velocidade da transição
    slidesToShow: 5, // Quantidade de slides visíveis
    slidesToScroll: 1, // Quantidade de slides a rolar
    autoplay: true, // Autoplay ativado
    autoplaySpeed: 5000, // Intervalo de 5 segundos
    pauseOnHover: true, // Pausa ao passar o mouse
    arrows: true, // Mostra as setas de navegação
    responsive: [
      {
        breakpoint: 1024, // Ajustes para telas menores
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600, // Ajustes para telas móveis
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
    // Personalização das bolinhas (dots)
    appendDots: (dots) => (
      <Box
        sx={{
          position: "absolute",
          bottom: "-40px", // Ajusta a posição das bolinhas
          "& .slick-dots li button:before": {
            color: theme.palette.text.secondary, // Cor das bolinhas inativas
            fontSize: "12px", // Tamanho das bolinhas
          },
          "& .slick-dots li.slick-active button:before": {
            color: theme.palette.primary.main, // Cor da bolinha ativa
          },
        }}
      >
        <ul style={{ margin: "0px" }}>{dots}</ul>
      </Box>
    ),
  };

  return (
    <Box
      sx={{
        marginTop: "3rem",
        marginBottom: "3rem",
        padding: "3rem",
        backgroundColor: theme.palette.background.paper, // Usando a cor de fundo do tema
        borderRadius: "12px", // Bordas mais arredondadas
        boxShadow: theme.shadows[3], // Sombra do tema
      }}
    >
      <Typography variant="h5" component="h3" align="center" gutterBottom sx={{ fontWeight: "bold" }}>
        Nossos Corretores
      </Typography>
      <Box sx={{ position: "relative", paddingBottom: "50px" }}>
        {" "}
        {/* Espaço para as bolinhas */}
        <Slider {...settings}>
          {corretores
            .filter((corretor) => {
              // Filtra apenas corretores ativos, com cargo "Corretor" e CRECI válido
              const creciFormatado = validarEFormatarCreci(corretor.Creci);
              return corretor.Ativo && corretor.Cargo === "Corretor" && creciFormatado !== null;
            })
            .map((corretor) => {
              const creciFormatado = validarEFormatarCreci(corretor.Creci); // Formata o CRECI
              return (
                <Box
                  key={corretor.Id}
                  sx={{
                    textAlign: "center",
                    padding: "0 1rem",
                    "&:hover": {
                      transform: "scale(1.05)", // Efeito de zoom ao passar o mouse
                      transition: "transform 0.3s ease",
                    },
                  }}
                >
                  <Avatar
                    src={corretor.UrlAvatar || "/img/avatar-placeholder.png"} // Imagem do corretor ou placeholder
                    alt={corretor.NomeComercial}
                    sx={{
                      width: 120,
                      height: 120,
                      margin: "0 auto",
                      border: `2px solid ${theme.palette.primary.main}`, // Borda usando a cor primária do tema
                    }}
                  />
                  <Typography variant="h6" sx={{ marginTop: "1.5rem", fontWeight: "bold" }}>
                    {formatarNome(corretor.NomeComercial)} {/* Nome formatado */}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ marginTop: "0.5rem" }}>
                    CRECI: {creciFormatado} {/* CRECI formatado */}
                  </Typography>
                </Box>
              );
            })}
        </Slider>
      </Box>
    </Box>
  );
};

export default CorretoresList;