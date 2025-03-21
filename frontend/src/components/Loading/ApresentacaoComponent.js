import React, { useEffect, useState } from "react";
import { Box, Typography, LinearProgress } from "@mui/material";

const ApresentacaoComponent = ({ onComplete }) => {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let intervalId;

    // Função para incrementar o progresso
    const incrementProgress = () => {
      setProgress((prevProgress) => {
        const nextProgress = prevProgress + 25;
        if (nextProgress > 100) return 100; // Garante que não ultrapasse 100%
        return nextProgress;
      });
    };

    // Inicia o incremento do progresso
    intervalId = setInterval(() => {
      incrementProgress();
    }, 1000); // Incrementa a cada 1 segundo

    // Finaliza o progresso ao atingir 100%
    const timeoutId = setTimeout(() => {
      clearInterval(intervalId); // Para o incremento
      setTimeout(() => {
        setVisible(false); // Oculta o componente após 500ms
        if (onComplete) onComplete(); // Notifica que o carregamento foi concluído
      }, 500);
    }, 4000); // Garante que o progresso finalize após 4 segundos

    // Limpa os intervalos e timeouts ao desmontar o componente
    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [onComplete]);

  // Não renderiza o componente se não estiver visível
  if (!visible) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "background.paper",
        zIndex: 9999,
        transition: "opacity 0.5s ease",
        opacity: visible ? 1 : 0,
      }}
    >
      <Box
        sx={{
          textAlign: "center",
          width: "90%",
          maxWidth: 500,
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", mb: 2 }}>
          Bem-vindo à Nossa Imobiliária
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Carregando o melhor para você...
        </Typography>
        <Box
          component="img"
          src="/img/logo.gif"
          alt="Carregando..."
          sx={{
            width: "100%",
            maxWidth: 300,
            height: "auto",
            mb: 3,
          }}
        />
        <Typography variant="body1" sx={{ mb: 1 }}>
          Carregando o site, por favor aguarde...
        </Typography>
        <Box sx={{ width: "100%", mt: 2 }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 10,
              borderRadius: 5,
              backgroundColor: "rgba(0, 0, 0, 0.1)",
              "& .MuiLinearProgress-bar": {
                borderRadius: 5,
                backgroundColor: "primary.main",
                // Removida a animação para evitar comportamento inconsistente
              },
            }}
          />
        </Box>
        <Typography variant="body2" sx={{ mt: 2 }}>
          {Math.round(progress)}%
        </Typography>
      </Box>
    </Box>
  );
};

export default ApresentacaoComponent;