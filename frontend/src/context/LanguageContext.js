// src/context/LanguageContext.js
import React, { createContext, useState } from "react";

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("pt"); // Idioma inicial: PT-BR

  const toggleLanguage = () => {
    setLanguage((prevLang) => (prevLang === "pt" ? "en" : prevLang === "en" ? "es" : "pt"));
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};