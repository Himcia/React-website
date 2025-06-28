import React, { useState, useEffect } from "react";
import { Container, TextField, Typography, Button, Alert, Paper } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth, verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth";

export default function ResetPassword() {
  const auth = getAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const oobCode = query.get("oobCode");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!oobCode) {
      setError("⚠️ Brak kodu resetującego w linku.");
      return;
    }

    verifyPasswordResetCode(auth, oobCode)
      .then((email) => setEmail(email))
      .catch(() => {
        setError("❌ Link resetujący jest nieprawidłowy lub wygasł.");
      });
  }, [auth, oobCode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      return setError("❗ Hasła nie są takie same.");
    }

    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setSuccess("✅ Hasło zostało pomyślnie zmienione. Możesz się teraz zalogować.");
    } catch (err) {
      setError("❌ Błąd: " + err.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ mt: 8, p: 4 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          🔐 Ustaw nowe hasło
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
            <br />
            <Button
              variant="text"
              onClick={() => navigate("/login")}
              sx={{ mt: 1, fontWeight: "bold", textTransform: "none" }}
            >
              🔑 Przejdź do logowania
            </Button>
          </Alert>
        )}

        {!success && (
          <form onSubmit={handleSubmit}>
            <TextField
              label="Nowe hasło"
              type="password"
              fullWidth
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Powtórz hasło"
              type="password"
              fullWidth
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button type="submit" variant="contained" fullWidth>
              💾 Zapisz nowe hasło
            </Button>
          </form>
        )}
      </Paper>
    </Container>
  );
}
