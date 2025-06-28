import React, { useState } from "react";
import { Container, TextField, Button, Typography, Alert, Paper } from "@mui/material";
import { resetPassword } from "../Services/authservice";
import { useNavigate } from "react-router-dom";


export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await resetPassword(email);
      setSuccess("📬 Sprawdź swoją skrzynkę — wysłaliśmy link do zmiany hasła.");
    } catch (err) {
      setError("❌ Błąd: " + err.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ mt: 8, p: 4 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          🔐 Resetowanie hasła
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Adres e-mail"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Button variant="contained" type="submit" fullWidth>
            💌 Wyślij link resetujący
          </Button>
        </form>
      </Paper>
      <Button
        variant="text"
        fullWidth
        sx={{ mt: 2 }}
        onClick={() => navigate("/login")}
        >
        ← Powrót do logowania
     </Button>

    </Container>
  );
}
