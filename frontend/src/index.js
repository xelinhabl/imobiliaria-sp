import React from "react";
import { createRoot } from "react-dom/client"; // Novo método no React 18
import App from "./App";
import { ThemeContextProvider } from "./context/ThemeContext"; // Atualizado para o nome correto
import { LanguageProvider } from "./context/LanguageContext"; // Provider para o idioma
import "./index.css";

const container = document.getElementById("root");
const root = createRoot(container); // Cria a raiz

root.render(
  <React.StrictMode>
    {/* Envolve a aplicação com os providers de tema e idioma */}
    <ThemeContextProvider>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </ThemeContextProvider>
  </React.StrictMode>
);