import React from "react";
import { createRoot } from "react-dom/client"; // Novo método no React 18
import App from "./App";
import { ThemeContextProvider } from "./context/ThemeContext"; // Provider para o tema
import { LanguageProvider } from "./context/LanguageContext"; // Provider para o idioma
import { AnimationProvider } from "./context/AnimationContext"; // Provider para animações
import "./index.css";

const container = document.getElementById("root");
const root = createRoot(container); // Cria a raiz

root.render(
  <React.StrictMode>
    {/* Envolve a aplicação com o ThemeProvider do Material-UI */}
    <ThemeContextProvider>
      <LanguageProvider>
        <AnimationProvider>
          <App />
        </AnimationProvider>
      </LanguageProvider>
    </ThemeContextProvider>
  </React.StrictMode>
);

// Garante que o site volte ao topo após o carregamento
window.addEventListener("load", () => {
  window.scrollTo(0, 0);
});