import React, { useContext, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ThemeContext } from "../context/ThemeContext"; // Importar o contexto do tema
import ApresentacaoComponent from "../components/Loading/ApresentacaoComponent";
import Imoveis from "../components/Imoveis/Imoveis"; // Importar o componente Imoveis
import "./Index_pages.css"; // Estilos personalizados para o Home

const Home = () => {
  const { isDarkMode } = useContext(ThemeContext); // Acessar o estado do tema
  const [loadingComplete, setLoadingComplete] = useState(false); // Estado para controlar o carregamento

  if (!loadingComplete) {
    // Retorna apenas o componente de apresentação até que o carregamento seja concluído
    return <ApresentacaoComponent onComplete={() => setLoadingComplete(true)} />;
  }

  // Configurações do carrossel
  const settings = {
    dots: true, // Mostra os pontos de navegação (bolinhas)
    infinite: true, // Loop infinito
    speed: 500, // Velocidade da transição
    slidesToShow: 1, // Quantidade de slides visíveis
    slidesToScroll: 1, // Quantidade de slides a rolar
    autoplay: true, // Autoplay ativado
    autoplaySpeed: 5000, // Intervalo de 5 segundos
    pauseOnHover: true, // Pausa ao passar o mouse
    arrows: true, // Mostra as setas de navegação
  };

  // Lista de banners (imagens)
  const banners = [
    "banner_1.png",
    "banner_2.png",
    "banner_3.png",
    "banner_4.png",
    "banner_5.png",
    "banner_6.png",
  ];

  return (
    <div className={`home-container ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      {/* Carrossel de banners */}
      <div className="carousel-container">
        <Slider {...settings}>
          {banners.map((banner, index) => (
            <div key={index} className="carousel-slide">
              <img
                src={`/img/${banner}`} // Caminho das imagens na pasta public/img
                alt={`Banner ${index + 1}`}
                className="carousel-image"
              />
            </div>
          ))}
        </Slider>
      </div>

      {/* Conteúdo adicional da página inicial */}
      <div className={`home-content ${isDarkMode ? "dark-mode" : "light-mode"}`}>
        <h1>Bem-vindo à Nossa Imobiliária</h1>
        <p>
          Encontre o imóvel dos seus sonhos com a gente! Temos as melhores opções
          para compra, venda e locação.
        </p>
      </div>

      {/* Componente Imoveis */}
      <Imoveis />
    </div>
  );
};

export default Home;