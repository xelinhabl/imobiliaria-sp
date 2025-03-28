import React, { useContext, useState, useEffect, useMemo } from "react";
import { 
  Box, 
  Typography, 
  useMediaQuery, 
  useTheme,
  Paper,
  Grow, 
} from "@mui/material";
import { ThemeContext } from "../context/ThemeContext";
import ApresentacaoComponent from "../components/Loading/ApresentacaoComponent";
import ImoveisContainer from "../components/Imoveis/ImoveisContainer";
import { useSigaviApi } from "../services/api";
import BannerCarousel from "../components/Banner/BannerCarousel";

const Home = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [banners, setBanners] = useState([]);
  const [loadingBanners, setLoadingBanners] = useState(true);
  const { apiRequest } = useSigaviApi();

  // Otimização: Carregar banners apenas uma vez
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await apiRequest('BANNERS');
        setBanners(response);
      } catch (error) {
        console.error('Erro ao carregar banners:', error);
      } finally {
        setLoadingBanners(false);
      }
    };

    fetchBanners();
  }, [apiRequest]);

  // Otimização: useMemo para evitar recálculos desnecessários
  const bannerCarouselComponent = useMemo(() => (
    <BannerCarousel 
      banners={banners} 
      loading={loadingBanners}
      emptyMessage="Nenhum banner disponível no momento"
    />
  ), [banners, loadingBanners]);

  if (!loadingComplete) {
    return <ApresentacaoComponent onComplete={() => setLoadingComplete(true)} />;
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      backgroundColor: isDarkMode ? theme.palette.grey[900] : theme.palette.grey[50]
    }}>
      {/* Seção do Carrossel - Otimizada com useMemo */}
      {bannerCarouselComponent}

      {/* Seção de Conteúdo */}
      <Grow in={true} timeout={1000}>
        <Box sx={{ py: 8, px: isMobile ? 2 : 4 }}>
          <Paper elevation={6} sx={{ 
            p: 4, 
            backgroundColor: isDarkMode ? theme.palette.grey[800] : theme.palette.background.paper,
            borderRadius: '12px',
            mb: 4
          }}>
            <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 700 }}>
              Bem-vindo à Nossa Imobiliária
            </Typography>
            <Typography variant="h5" paragraph sx={{ mb: 3 }}>
              Encontre o imóvel dos seus sonhos com a gente!
            </Typography>
            <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem' }}>
              Temos as melhores opções para compra, venda e locação.
            </Typography>
          </Paper>
          
          <ImoveisContainer />
        </Box>
      </Grow>
    </Box>
  );
};

export default Home;