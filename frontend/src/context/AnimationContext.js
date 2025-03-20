import React, { createContext, useContext, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

// Cria o contexto
const AnimationContext = createContext();

// Provider de animações
export const AnimationProvider = ({ children }) => {
  // Inicializa o AOS quando o componente é montado
  useEffect(() => {
    AOS.init({
      duration: 1000, // Duração da animação em milissegundos
      once: true, // A animação ocorre apenas uma vez
    });
  }, []);

  return (
    <AnimationContext.Provider value={{}}>
      {children}
    </AnimationContext.Provider>
  );
};

// Hook personalizado para usar o contexto
export const useAnimation = () => useContext(AnimationContext);