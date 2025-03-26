import React, { useContext, useState, useEffect } from "react";
import { 
  Box, 
  CircularProgress, 
  Typography, 
  useMediaQuery, 
  useTheme,
  Paper,
  IconButton
} from "@mui/material";
import { 
  ArrowBackIos as PrevIcon, 
  ArrowForwardIos as NextIcon,
  Celebration as PremiumIcon
} from "@mui/icons-material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ThemeContext } from "../context/ThemeContext";
import ApresentacaoComponent from "../components/Loading/ApresentacaoComponent";
import ImoveisContainer from "../components/Imoveis/ImoveisContainer";
import axios from "axios";

const Home = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [banners, setBanners] = useState([]);
  const [loadingBanners, setLoadingBanners] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/banners/');
        setBanners(response.data);
      } catch (error) {
        console.error('Erro ao carregar banners:', error);
      } finally {
        setLoadingBanners(false);
      }
    };

    fetchBanners();
  }, []);

  // Custom arrows para o slider
  const SampleNextArrow = (props) => {
    const { onClick } = props;
    return (
      <IconButton
        onClick={onClick}
        sx={{
          position: 'absolute',
          right: 20,
          zIndex: 1,
          color: 'white',
          backgroundColor: 'rgba(0,0,0,0.3)',
          '&:hover': {
            backgroundColor: 'rgba(0,0,0,0.5)'
          }
        }}
      >
        <NextIcon fontSize="large" />
      </IconButton>
    );
  };

  const SamplePrevArrow = (props) => {
    const { onClick } = props;
    return (
      <IconButton
        onClick={onClick}
        sx={{
          position: 'absolute',
          left: 20,
          zIndex: 1,
          color: 'white',
          backgroundColor: 'rgba(0,0,0,0.3)',
          '&:hover': {
            backgroundColor: 'rgba(0,0,0,0.5)'
          }
        }}
      >
        <PrevIcon fontSize="large" />
      </IconButton>
    );
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    pauseOnHover: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    dotsClass: "slick-dots slick-thumb",
    appendDots: dots => (
      <div style={{ bottom: isMobile ? 10 : 20 }}>
        <ul style={{ margin: 0 }}>{dots}</ul>
      </div>
    ),
    customPaging: i => (
      <div style={{
        width: isMobile ? 8 : 12,
        height: isMobile ? 8 : 12,
        borderRadius: '50%',
        backgroundColor: i === settings.currentSlide ? theme.palette.primary.main : 'rgba(255,255,255,0.5)'
      }} />
    )
  };

  if (!loadingComplete) {
    return <ApresentacaoComponent onComplete={() => setLoadingComplete(true)} />;
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      backgroundColor: isDarkMode ? theme.palette.grey[900] : theme.palette.grey[50]
    }}>
      {/* Hero Section - Carrossel Premium */}
      <Box sx={{
        position: 'relative',
        height: isMobile ? '70vh' : '90vh',
        maxHeight: '1000px',
        width: '100%',
        overflow: 'hidden'
      }}>
        {loadingBanners ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <CircularProgress size={60} color="primary" />
          </Box>
        ) : banners.length > 0 ? (
          <Slider {...settings}>
            {banners.map((banner) => (
              <Box key={banner.id} sx={{ height: isMobile ? '70vh' : '90vh', position: 'relative' }}>
                <Box
                  component="img"
                  src={banner.imagem_url}
                  alt={banner.titulo || `Banner ${banner.id}`}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    filter: isDarkMode ? 'brightness(0.7)' : 'none'
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/img/placeholder.jpg";
                  }}
                />
                
                {/* Overlay de conteúdo */}
                <Box sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
                  p: 4,
                  color: 'white'
                }}>
                  <Typography 
                    variant={isMobile ? "h4" : "h2"} 
                    component="h1"
                    sx={{ 
                      fontWeight: 700,
                      mb: 2,
                      textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                    }}
                  >
                    {banner.titulo || 'Nossos Destaques'}
                  </Typography>
                  {banner.descricao && (
                    <Typography 
                      variant={isMobile ? "body1" : "h6"} 
                      sx={{ 
                        maxWidth: '800px',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                      }}
                    >
                      {banner.descricao}
                    </Typography>
                  )}
                </Box>
                
                {/* Badge premium para banners especiais */}
                {banner.imagem_url?.endsWith('.gif') && (
                  <Box sx={{
                    position: 'absolute',
                    top: 20,
                    right: 20,
                    backgroundColor: theme.palette.primary.main,
                    color: 'white',
                    borderRadius: '50%',
                    width: 60,
                    height: 60,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 3
                  }}>
                    <PremiumIcon fontSize="large" />
                  </Box>
                )}
              </Box>
            ))}
          </Slider>
        ) : (
          <Box sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isDarkMode ? theme.palette.grey[800] : theme.palette.grey[200],
            color: isDarkMode ? theme.palette.text.primary : theme.palette.text.secondary
          }}>
            <Typography variant="h5">Nenhum banner disponível no momento</Typography>
          </Box>
        )}
      </Box>

      {/* Conteúdo abaixo do carrossel */}
      <Box sx={{ py: 8, px: isMobile ? 2 : 4 }}>
        <Paper elevation={3} sx={{ 
          p: 4, 
          mb: 4,
          backgroundColor: isDarkMode ? theme.palette.grey[800] : theme.palette.background.paper
        }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Bem-vindo à Nossa Imobiliária
          </Typography>
          <Typography variant="body1" paragraph>
            Encontre o imóvel dos seus sonhos com a gente! Temos as melhores opções
            para compra, venda e locação.
          </Typography>
        </Paper>
        
        <ImoveisContainer />
      </Box>
    </Box>
  );
};

export default Home;