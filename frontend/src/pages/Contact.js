import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // Importe useLocation
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { NumericFormat } from "react-number-format";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Contact = () => {
  const location = useLocation(); // Para acessar os dados passados via state
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    mensagem: "",
    imovelId: "",
    titulo: "",
    valor: "",
    bairro: "",
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Preenche os dados do imóvel ao carregar o componente
  useEffect(() => {
    if (location.state) {
      const { imovelId, titulo, valor, bairro } = location.state;
      setFormData((prevData) => ({
        ...prevData,
        imovelId,
        titulo,
        valor,
        bairro,
        mensagem: `Olá, estou interessado no imóvel "${titulo}" no bairro ${bairro} com valor ${new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(valor)}. Por favor, entre em contato comigo.`,
      }));
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setSnackbarMessage("Por favor, insira um e-mail válido.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/contact/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setSnackbarMessage("Mensagem enviada com sucesso!");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        setFormData({ nome: "", email: "", telefone: "", mensagem: "", imovelId: "", titulo: "", valor: "", bairro: "" });
      } else {
        setSnackbarMessage("Erro ao enviar a mensagem.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Erro ao enviar o formulário:", error);
      setSnackbarMessage("Erro ao enviar a mensagem.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Contato
        </Typography>
        <Typography variant="body1" align="center" sx={{ mb: 4 }}>
          Entre em contato conosco. Responderemos o mais breve possível.
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <TextField
            label="Nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="E-mail"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            fullWidth
            error={!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) && formData.email !== ""}
            helperText={
              !formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) && formData.email !== ""
                ? "Insira um e-mail válido."
                : ""
            }
          />
          <NumericFormat
            customInput={TextField}
            label="Telefone"
            name="telefone"
            value={formData.telefone}
            onChange={handleChange}
            format="(##) #####-####"
            fullWidth
            required
          />
          <TextField
            label="Mensagem"
            name="mensagem"
            value={formData.mensagem}
            onChange={handleChange}
            required
            multiline
            rows={4}
            fullWidth
          />
          {/* Campos ocultos para enviar informações do imóvel */}
          <input type="hidden" name="imovelId" value={formData.imovelId} />
          <input type="hidden" name="titulo" value={formData.titulo} />
          <input type="hidden" name="valor" value={formData.valor} />
          <input type="hidden" name="bairro" value={formData.bairro} />
          <Button type="submit" variant="contained" color="primary" size="large">
            Enviar
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Contact;