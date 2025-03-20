import React, { useContext, useEffect } from "react";
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
import Footer from "./components/Fotter/Fotter"; // Corrigi o nome do componente
import AOS from "aos"; // Importe o AOS
import "aos/dist/aos.css"; // Importe o CSS do AOS

const App = () => {
  const { isDarkMode } = useContext(ThemeContext);

  // Inicialize o AOS quando o componente for montado
  useEffect(() => {
    AOS.init({
      duration: 1000, // Duração da animação em milissegundos
      once: true, // A animação ocorre apenas uma vez
    });
  }, []);

  return (
    <BrowserRouter>
      <div className={`App ${isDarkMode ? "dark-mode" : "light-mode"}`}>
        <ApresentacaoComponent />
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<About />} />
          <Route path="/contato" element={<Contact />} />
        </Routes>
        <Footer />
        <WhatsAppButton />
        <CookiesConsent />
      </div>
    </BrowserRouter>
  );
};

export default App;