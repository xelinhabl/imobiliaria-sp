import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeContext } from "./context/ThemeContext";
import Header from "./components/Header/Header";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import "./App.css";
import ApresentacaoComponent from "./components/Loading/ApresentacaoComponent";
import WhatsAppButton from "./components/Whatsapp/WhatsappButton";
import CookiesConsent from "./components/CookiesConsent/CookiesConsent";
import Footer from "./components/Fotter/Fotter";
import AOS from "aos";
import "aos/dist/aos.css";

const App = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [loadingComplete, setLoadingComplete] = useState(() => {
    // Verifica se o carregamento já foi concluído anteriormente
    return localStorage.getItem("loadingComplete") === "true";
  });

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const handleLoadingComplete = () => {
    setLoadingComplete(true);
    localStorage.setItem("loadingComplete", "true"); // Armazena no localStorage que o carregamento foi concluído
    window.scrollTo(0, 0); // Garante que a página inicie no topo
  };

  return (
    <BrowserRouter>
      <div className={`App ${isDarkMode ? "dark-mode" : "light-mode"}`}>
        {!loadingComplete && (
          <ApresentacaoComponent onComplete={handleLoadingComplete} />
        )}

        {loadingComplete && (
          <>
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/sobre" element={<About />} />
              <Route path="/contato" element={<Contact />} />
            </Routes>
            <Footer />
            <WhatsAppButton />
            <CookiesConsent />
          </>
        )}
      </div>
    </BrowserRouter>
  );
};

export default App;