import React, { useState, useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa"; // Importar ícone do WhatsApp
import { Box, Badge, keyframes, Tooltip } from "@mui/material"; // Componentes do Material-UI

const WhatsappButton = () => {
  const whatsappNumber = "1193802000"; // Substitua pelo número da imobiliária
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  // Estado para o contador de mensagens
  const [messageCount, setMessageCount] = useState(0);

  // Estado para controlar a animação de vibração
  const [isVibrating, setIsVibrating] = useState(false);

  // Efeito para incrementar o contador a cada 7 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageCount((prevCount) => prevCount + 1);
    }, 7000); // 7 segundos

    return () => clearInterval(interval); // Limpar intervalo ao desmontar
  }, []);

  // Animação de vibração com mais intensidade e duração
  const vibrate = keyframes`
    0% { transform: translateX(0); }
    25% { transform: translateX(-15px); } // Aumentar a distância para -15px
    50% { transform: translateX(15px); }  // Aumentar a distância para 15px
    75% { transform: translateX(-15px); } // Aumentar a distância para -15px
    100% { transform: translateX(0); }
  `;

  // Efeito para aplicar a animação de vibração a cada 5 segundos
  useEffect(() => {
    const vibrationInterval = setInterval(() => {
      setIsVibrating(true); // Ativar vibração
      setTimeout(() => {
        setIsVibrating(false); // Desativar vibração após 1 segundo
      }, 1000); // Aumentar a duração da vibração para 1 segundo
    }, 5000); // 5 segundos

    return () => clearInterval(vibrationInterval); // Limpar intervalo ao desmontar
  }, []);

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: "20px",
        right: "40px", // Aumentar o espaçamento da lateral direita
        zIndex: 1000, // Garantir que o botão fique acima de outros elementos
        animation: isVibrating ? `${vibrate} 1s ease-in-out` : "none", // Aplicar animação de vibração com duração de 1s
      }}
    >
      <Tooltip
        title="Fale com um de nossos corretores !!!"
        placement="left"
        arrow
        componentsProps={{
          tooltip: {
            sx: {
              backgroundColor: "#25D366", // Cor do tooltip
              color: "#fff", // Cor do texto
              fontSize: "0.9rem", // Tamanho da fonte
              fontWeight: "bold", // Fonte em negrito
              animation: `${fadeIn} 0.3s ease-in-out`, // Animação de fadeIn
            },
          },
          arrow: {
            sx: {
              color: "#25D366", // Cor da seta do tooltip
            },
          },
        }}
      >
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none" }}
        >
          <Badge
            badgeContent={messageCount}
            color="error"
            sx={{
              "& .MuiBadge-badge": {
                top: "10px",
                right: "10px",
                fontSize: "0.8rem",
                fontWeight: "bold",
              },
            }}
          >
            <Box
              sx={{
                backgroundColor: "#25D366",
                borderRadius: "50%",
                width: "60px",
                height: "60px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.1)",
                },
              }}
            >
              <FaWhatsapp 
                style={{ 
                  color: "#fff", 
                  fontSize: "30px" 
                }} 
              />
            </Box>
          </Badge>
        </a>
      </Tooltip>
    </Box>
  );
};

// Animação de fadeIn para o tooltip
const fadeIn = keyframes`
  0% { opacity: 0; transform: translateX(10px); }
  100% { opacity: 1; transform: translateX(0); }
`;

export default WhatsappButton;