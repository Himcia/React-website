import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Alert
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from '@mui/material/styles';


export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const theme = useTheme();

  const autofillStyles = {
    '& input:-webkit-autofill': {
      WebkitBoxShadow: `0 0 0 1000px ${theme.palette.background.default} inset`,
      WebkitTextFillColor: theme.palette.text.primary,
      transition: 'background-color 5000s ease-in-out 0s',
    },
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch {
      setError("❌ Nie udało się zalogować. Sprawdź dane.");
    }
  }

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 8, p: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontFamily: 'Bebas Neue' }}>
          🔐 Logowanie
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            variant="outlined"
            autoComplete="off"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{
              mb: 2,
              '& input:-webkit-autofill': {
                WebkitBoxShadow: `0 0 0 0px ${theme.palette.background.paper} inset`,
                WebkitTextFillColor: theme.palette.text.primary,
                transition: 'background-color 5000s ease-in-out 0s',
                autofillStyles
              },
            }}
          />


          <TextField
            fullWidth
            label="Hasło"
            type="password"
            variant="outlined"
            autoComplete="off"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{
              mb: 2,
                '& input:-webkit-autofill': {
                WebkitBoxShadow: `0 0 0 0px ${theme.palette.background.paper} inset`,
                WebkitTextFillColor: theme.palette.text.primary,
                transition: 'background-color 5000s ease-in-out 0s',
                autofillStyles
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: "#403433",
              "&:hover": { backgroundColor: "#D9B3B0", color: "#403433" }
            }}
          >
            🔓 Zaloguj się
          </Button>

          <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
            Nie masz konta?{" "}
            <Button
              variant="text"
              size="small"
              component={Link}
              to="/register"
              sx={{ textTransform: "none", fontWeight: "bold" }}
            >
              Zarejestruj się
            </Button>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
