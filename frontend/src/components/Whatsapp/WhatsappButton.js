import React from "react";
import { FaWhatsapp } from "react-icons/fa"; // Importar ícone do WhatsApp
import "./WhatsappButton.css"; // Estilos específicos para o botão

const WhatsappButton = () => {
  const whatsappNumber = "1193802000"; // Substitua pelo número da imobiliária
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-button"
    >
      <FaWhatsapp 
        className="whatsapp-icon" 
        style={{ color: "#25D366" }} // Definir cor verde do WhatsApp
      /> 
    </a>
  );
};

export default WhatsappButton;
