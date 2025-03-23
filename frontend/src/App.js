import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeContext } from "./context/ThemeContext";
import { CssBaseline, useTheme } from "@mui/material"; // Adicione useTheme
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
import TodosImoveis from "./pages/TodosImoveis";
import DetailsImoveis from './pages/DetailsImoveis';

const App = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const theme = useTheme(); // Use o tema do Material-UI
  const [loadingComplete, setLoadingComplete] = useState(() => {
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
    localStorage.setItem("loadingComplete", "true");
    window.scrollTo(0, 0);
  };

  return (
    <BrowserRouter>
      <CssBaseline />
      <div className={`App ${isDarkMode ? "dark-mode" : "light-mode"}`} style={{ backgroundColor: theme.palette.background.default }}>
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
              <Route path="/todos-imoveis" element={<TodosImoveis />} />
              <Route path="/imovel/:id" element={<DetailsImoveis />} />
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