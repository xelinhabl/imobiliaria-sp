import React, { useEffect, useState } from "react";
import "./ApresentacaoComponent.css"; // Estilos específicos para o componente

const ApresentacaoComponent = ({ onComplete }) => {
  const [visible, setVisible] = useState(true); // Estado para controlar a visibilidade

  useEffect(() => {
    // Simula o carregamento do site
    const timer = setTimeout(() => {
      setVisible(false); // Oculta o componente após 3 segundos
      if (onComplete) onComplete(); // Notifica que o carregamento foi concluído
    }, 3000);

    return () => clearTimeout(timer); // Limpa o timer ao desmontar o componente
  }, [onComplete]);

  if (!visible) return null; // Não renderiza o componente se não estiver visível

  return (
    <div className="apresentacao-overlay"> {/* Fundo transparente */}
      <div className="apresentacao-content">
        <h1>Bem-vindo à Nossa Imobiliária</h1>
        <p>Carregando o melhor para você...</p>
        <img
          src="/img/logo.gif" // Caminho do GIF na pasta public/img
          alt="Carregando..."
          className="loading-gif"
          style={{ width: "700px", height: "700px" }} // Aumenta o tamanho do GIF
        />
      </div>
    </div>
  );
};

export default ApresentacaoComponent;