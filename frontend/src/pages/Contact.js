import React, { useState } from "react";
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
import { NumericFormat } from "react-number-format"; // Substituição do react-input-mask

// Componente Alert personalizado para o Snackbar
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Contact = () => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    mensagem: "",
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Função para lidar com a mudança nos campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Função para enviar o formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação básica do e-mail
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
        setFormData({ nome: "", email: "", telefone: "", mensagem: "" }); // Limpa o formulário
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

  // Função para fechar o Snackbar
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
          <Button type="submit" variant="contained" color="primary" size="large">
            Enviar
          </Button>
        </Box>
      </Paper>

      {/* Snackbar para exibir mensagem de sucesso ou erro */}
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