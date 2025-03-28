// App.js (atualizado)
import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeContext } from "./context/ThemeContext";
import { CssBaseline, useTheme } from "@mui/material";
import Header from "./components/Header/Header";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import "./App.css";
import ApresentacaoComponent from "./components/Loading/ApresentacaoComponent";
import WhatsAppButton from "./components/Whatsapp/WhatsappButton";
import CookiesConsent from "./components/CookiesConsent/CookiesConsent";
import Footer from "./components/Footer/Footer";
import AOS from "aos";
import "aos/dist/aos.css";
import TodosImoveis from "./pages/TodosImoveis";
import DetailsImoveis from './pages/DetailsImoveis';
import UpPage from "./components/UpPage/UpPage";
import Agendamentos from "./pages/Agendamentos";
import { SigaviApiProvider } from "./services/api";

const App = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const theme = useTheme();
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
    <SigaviApiProvider>
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
                <Route path="/agendamentos" element={<Agendamentos />} />
              </Routes>
              <Footer />
              <WhatsAppButton />
              <CookiesConsent />
              <UpPage />
            </>
          )}
        </div>
      </BrowserRouter>
    </SigaviApiProvider>
  );
};

export default App;