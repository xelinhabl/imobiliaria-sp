import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  CircularProgress,
  Container,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Divider,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
} from "@mui/material";
import {
  Bed as BedIcon,
  Bathtub as BathtubIcon,
  DirectionsCar as CarIcon,
  CropSquare as AreaIcon,
  Home as HomeIcon,
  LocationOn as LocationIcon,
  MonetizationOn as PriceIcon,
  Star as StarIcon,
  ExpandMore as ExpandMoreIcon,
  Map as MapIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AnimatedSection from "../components/Animated/AnimatedSection";
import Map from "./Map"; // Importe o componente de mapa

const DetailsImoveis = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [imovel, setImovel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Autenticação
        const authParams = new URLSearchParams();
        authParams.append("username", "integracao");
        authParams.append("password", "HScNneuN6PKxDq0");
        authParams.append("grant_type", "password");

        const authResponse = await axios.post(
          "https://cmarqx.sigavi360.com.br/Sigavi/api/Acesso/Token",
          authParams,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );

        const token = authResponse.data.access_token;

        // Buscar detalhes do imóvel
        const imovelResponse = await axios.get(
          `https://cmarqx.sigavi360.com.br/Sigavi/Api/Site/GetFichaTecnica/${id}?contaClick=true`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setImovel(imovelResponse.data);
      } catch (err) {
        console.error("Erro ao buscar detalhes do imóvel:", err);
        setError("Falha ao carregar os detalhes do imóvel.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const settingsFotos = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const handleContatoClick = () => {
    navigate("/contato", {
      state: {
        imovelId: imovel?.Id,
        titulo: imovel?.Titulo,
        valor: imovel?.ValorVenda,
        bairro: imovel?.Bairro,
      },
    });
  };

  const handleAgendamentoClick = () => {
    navigate("/agendamento", {
      state: {
        imovelId: imovel?.Id,
        titulo: imovel?.Titulo,
        valor: imovel?.ValorVenda,
        bairro: imovel?.Bairro,
      },
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center">
        {error}
      </Typography>
    );
  }

  if (!imovel) {
    return (
      <Typography color="textSecondary" align="center">
        Nenhum dado do imóvel encontrado.
      </Typography>
    );
  }

  // Concatenar logradouro e número para formar o endereço completo
  const enderecoCompleto = `${imovel.Logradouro || ""}, ${imovel.Numero || ""} - ${imovel.Bairro || ""}, ${imovel.Cidade || ""} - ${imovel.UF || ""}`;

  return (
    <Container>
      <AnimatedSection animation="fade-up" delay="100">
        <Typography variant="h4" component="h1" gutterBottom align="center">
          {imovel.Titulo || "Detalhes do Imóvel"}
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {/* Carrossel de fotos */}
        {imovel.Fotos?.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Slider {...settingsFotos}>
              {imovel.Fotos.map((foto) => (
                <Card key={foto.Id}>
                  <CardMedia
                    component="img"
                    height="400"
                    image={foto.Url}
                    alt={foto.Descricao || "Foto do imóvel"}
                    sx={{ objectFit: "cover" }}
                  />
                </Card>
              ))}
            </Slider>
          </Box>
        )}

        {/* Informações principais */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                {imovel.Titulo && (
                  <Typography variant="h5" component="h2" gutterBottom align="center">
                    {imovel.Titulo}
                  </Typography>
                )}
                {imovel.Descricao && (
                  <Typography variant="body1" gutterBottom align="center">
                    {imovel.Descricao}
                  </Typography>
                )}

                {/* Destaques */}
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3, justifyContent: "center" }}>
                  {imovel.Dormitorio && (
                    <Chip icon={<BedIcon />} label={`${imovel.Dormitorio} Dormitórios`} />
                  )}
                  {imovel.WC && (
                    <Chip icon={<BathtubIcon />} label={`${imovel.WC} Banheiros`} />
                  )}
                  {imovel.Vaga && (
                    <Chip icon={<CarIcon />} label={`${imovel.Vaga} Vagas`} />
                  )}
                  {imovel.AreaTotal && (
                    <Chip icon={<AreaIcon />} label={`${imovel.AreaTotal}m² Área Total`} />
                  )}
                </Box>

                {/* Detalhes */}
                <Grid container spacing={2}>
                  {imovel.Tipo && (
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <HomeIcon color="primary" />
                        <Typography variant="body1">
                          <strong>Tipo:</strong> {imovel.Tipo}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                  {imovel.Bairro && (
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <LocationIcon color="primary" />
                        <Typography variant="body1">
                          <strong>Bairro:</strong> {imovel.Bairro}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                  {imovel.ValorVenda && (
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <PriceIcon color="primary" />
                        <Typography variant="body1">
                          <strong>Valor:</strong>{" "}
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(imovel.ValorVenda)}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                  {imovel.Disponibilidade && (
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <StarIcon color="primary" />
                        <Typography variant="body1">
                          <strong>Status:</strong> {imovel.Disponibilidade}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>

                {/* Descrição Detalhada */}
                {imovel.DescricaoDetalhada && (
                  <Accordion sx={{ mt: 3 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="h6">Descrição Detalhada</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body1">
                        {imovel.DescricaoDetalhada}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                )}

                {/* Características Adicionais */}
                {(imovel.AreaUtil || imovel.Andar || imovel.ValorCondominio || imovel.ValorIPTU || imovel.Caracteristicas?.length > 0) && (
                  <Accordion sx={{ mt: 3 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="h6">Características Adicionais</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        {imovel.AreaUtil && (
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body1">
                              <strong>Área Útil:</strong> {imovel.AreaUtil}m²
                            </Typography>
                          </Grid>
                        )}
                        {imovel.Andar && (
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body1">
                              <strong>Andar:</strong> {imovel.Andar}
                            </Typography>
                          </Grid>
                        )}
                        {imovel.ValorCondominio && (
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body1">
                              <strong>Condomínio:</strong>{" "}
                              {new Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              }).format(imovel.ValorCondominio)}
                            </Typography>
                          </Grid>
                        )}
                        {imovel.ValorIPTU && (
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body1">
                              <strong>IPTU:</strong>{" "}
                              {new Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              }).format(imovel.ValorIPTU)}
                            </Typography>
                          </Grid>
                        )}
                        {imovel.Caracteristicas?.length > 0 && (
                          <Grid item xs={12}>
                            <Typography variant="body1">
                              <strong>Outras Características:</strong>
                            </Typography>
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                              {imovel.Caracteristicas.map((caracteristica, index) => (
                                <Chip key={index} label={caracteristica.Nome} />
                              ))}
                            </Box>
                          </Grid>
                        )}
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Informações adicionais e ações */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom align="center">
                  Informações Adicionais
                </Typography>
                <Divider sx={{ mb: 2 }} />

                {/* Lista de informações */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {imovel.Dormitorio && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <BedIcon color="primary" />
                      <Typography variant="body1">
                        <strong>Dormitórios:</strong> {imovel.Dormitorio}
                      </Typography>
                    </Box>
                  )}
                  {imovel.WC && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <BathtubIcon color="primary" />
                      <Typography variant="body1">
                        <strong>Banheiros:</strong> {imovel.WC}
                      </Typography>
                    </Box>
                  )}
                  {imovel.Vaga && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CarIcon color="primary" />
                      <Typography variant="body1">
                        <strong>Vagas:</strong> {imovel.Vaga}
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Botões de ação */}
                <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<PhoneIcon />}
                    fullWidth
                    onClick={handleContatoClick}
                  >
                    Entrar em Contato
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<CalendarIcon />}
                    fullWidth
                    onClick={handleAgendamentoClick}
                  >
                    Agendar Visita
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Mapa de Localização */}
        {imovel.Latitude && imovel.Longitude && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom align="center">
              Localização
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                  <MapIcon color="primary" />
                  <Typography variant="body1">
                    <strong>Endereço:</strong> {enderecoCompleto}
                  </Typography>
                </Box>
                {/* Passar o endereço completo para o componente Map */}
                <Map endereco={enderecoCompleto} latitude={imovel.Latitude} longitude={imovel.Longitude} />
              </CardContent>
            </Card>
          </Box>
        )}
      </AnimatedSection>
    </Container>
  );
};

export default DetailsImoveis;