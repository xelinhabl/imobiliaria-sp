import React, { useContext } from "react";
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

const App = () => {
  const { isDarkMode } = useContext(ThemeContext);

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