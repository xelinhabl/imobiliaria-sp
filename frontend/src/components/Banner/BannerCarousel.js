import React from 'react';
import { 
  Box, 
  Typography, 
  styled, 
  useTheme,
  CircularProgress
} from '@mui/material';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { motion } from 'framer-motion';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';

// Utilitário para construir URLs de imagem
const getImageUrl = (path) => {
  if (!path) return '';
  if (/^https?:\/\//.test(path)) return path;
  
  const isProduction = process.env.NODE_ENV === 'production';
  const baseUrl = isProduction 
    ? process.env.REACT_APP_API_BASE_URL || 'https://seusite.com'
    : 'http://127.0.0.1:8000';
  
  return `${baseUrl}/${path.replace(/^\//, '')}`;
};

// Componente estilizado com dark mode
const StyledCarousel = styled(Carousel)(({ theme }) => ({
  '& .carousel': {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
    boxShadow: theme.shadows[4],
  },
  '& .carousel .slide': {
    background: theme.palette.background.default,
  },
  '& .carousel .control-dots': {
    display: 'none',
  },
  '& .carousel .control-arrow': {
    background: theme.palette.mode === 'dark' 
      ? 'rgba(255,255,255,0.2)' 
      : 'rgba(0,0,0,0.3)',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    top: '50%',
    transform: 'translateY(-50%)',
    transition: 'all 0.3s ease',
    '&:hover': {
      background: theme.palette.mode === 'dark' 
        ? 'rgba(255,255,255,0.3)' 
        : 'rgba(0,0,0,0.5)',
      transform: 'translateY(-50%) scale(1.1)',
    },
    [theme.breakpoints.down('sm')]: {
      width: '40px',
      height: '40px',
    },
  },
  '& .carousel .control-prev': {
    left: '20px',
  },
  '& .carousel .control-next': {
    right: '20px',
  },
}));

const BannerContainer = styled(motion.div)(({ theme }) => ({
  position: 'relative',
  height: '70vh',
  maxHeight: '800px',
  minHeight: '400px',
  width: '100%',
  overflow: 'hidden',
  [theme.breakpoints.down('md')]: {
    height: '50vh',
  },
  [theme.breakpoints.down('sm')]: {
    height: '40vh',
    minHeight: '300px',
  },
}));

const BannerImage = styled(motion.img)(({ theme }) => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  filter: theme.palette.mode === 'dark' ? 'brightness(0.8)' : 'none',
  transition: 'filter 0.5s ease',
}));

const BannerContent = styled(motion.div)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: theme.spacing(4),
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 100%)'
    : 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 100%)',
  color: theme.palette.common.white,
  textAlign: 'left',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(3),
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const BannerTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '3rem',
  marginBottom: theme.spacing(2),
  textShadow: '0 2px 4px rgba(0,0,0,0.5)',
  [theme.breakpoints.down('md')]: {
    fontSize: '2.2rem',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.8rem',
    marginBottom: theme.spacing(1),
  },
}));

const BannerDescription = styled(Typography)(({ theme }) => ({
  fontSize: '1.2rem',
  maxWidth: '60%',
  textShadow: '0 1px 2px rgba(0,0,0,0.5)',
  [theme.breakpoints.down('md')]: {
    maxWidth: '80%',
    fontSize: '1.1rem',
  },
  [theme.breakpoints.down('sm')]: {
    maxWidth: '100%',
    fontSize: '1rem',
  },
}));

const CounterIndicator = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(2),
  right: theme.spacing(2),
  backgroundColor: theme.palette.mode === 'dark'
    ? 'rgba(255,255,255,0.2)'
    : 'rgba(0,0,0,0.7)',
  color: theme.palette.common.white,
  padding: theme.spacing(1, 2),
  borderRadius: '20px',
  fontSize: '0.9rem',
  zIndex: 2,
  backdropFilter: 'blur(5px)',
}));

const BannerCarousel = ({ banners, loading, emptyMessage }) => {
  const theme = useTheme();

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        height="400px"
        bgcolor={theme.palette.background.paper}
        borderRadius={2}
      >
        <CircularProgress size={60} color="primary" />
      </Box>
    );
  }

  if (!banners || banners.length === 0) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        height="400px" 
        bgcolor={theme.palette.background.paper}
        borderRadius={2}
      >
        <Typography color="text.secondary">{emptyMessage}</Typography>
      </Box>
    );
  }

  const sortedBanners = [...banners].sort((a, b) => (a.ordem || 0) - (b.ordem || 0));

  return (
    <Box 
      sx={{ 
        position: 'relative',
        width: '100%',
        mb: 4,
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <StyledCarousel
        showThumbs={false}
        autoPlay
        infiniteLoop
        interval={6000}
        transitionTime={800}
        renderArrowPrev={(onClickHandler, hasPrev, label) => (
          <Box
            position="absolute"
            left={theme.spacing(3)}
            top="50%"
            zIndex={2}
            onClick={onClickHandler}
            sx={{
              cursor: 'pointer',
              transform: 'translateY(-50%)',
              background: theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.2)'
                : 'rgba(0,0,0,0.3)',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: theme.palette.mode === 'dark'
                  ? 'rgba(255,255,255,0.3)'
                  : 'rgba(0,0,0,0.5)',
                transform: 'translateY(-50%) scale(1.1)',
              },
              [theme.breakpoints.down('sm')]: {
                width: '40px',
                height: '40px',
                left: theme.spacing(1),
              },
            }}
          >
            <ArrowBackIos style={{ color: theme.palette.common.white }} />
          </Box>
        )}
        renderArrowNext={(onClickHandler, hasNext, label) => (
          <Box
            position="absolute"
            right={theme.spacing(3)}
            top="50%"
            zIndex={2}
            onClick={onClickHandler}
            sx={{
              cursor: 'pointer',
              transform: 'translateY(-50%)',
              background: theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.2)'
                : 'rgba(0,0,0,0.3)',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: theme.palette.mode === 'dark'
                  ? 'rgba(255,255,255,0.3)'
                  : 'rgba(0,0,0,0.5)',
                transform: 'translateY(-50%) scale(1.1)',
              },
              [theme.breakpoints.down('sm')]: {
                width: '40px',
                height: '40px',
                right: theme.spacing(1),
              },
            }}
          >
            <ArrowForwardIos style={{ color: theme.palette.common.white }} />
          </Box>
        )}
        renderIndicator={(onClickHandler, isSelected, index, label) => (
          <CounterIndicator>
            {index + 1} / {sortedBanners.length}
          </CounterIndicator>
        )}
      >
        {sortedBanners.map((banner) => (
          <BannerContainer key={banner.id}>
            <BannerImage
              src={getImageUrl(banner.imagem_url)}
              alt={banner.titulo || `Banner ${banner.id}`}
              initial={{ opacity: 0.9 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/static/images/placeholder-banner.jpg';
              }}
            />
            <BannerContent
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <BannerTitle variant="h2">
                {banner.titulo}
              </BannerTitle>
              {banner.descricao && (
                <BannerDescription variant="body1">
                  {banner.descricao}
                </BannerDescription>
              )}
            </BannerContent>
          </BannerContainer>
        ))}
      </StyledCarousel>
    </Box>
  );
};

export default BannerCarousel;