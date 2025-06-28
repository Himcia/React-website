import React, { useState } from 'react';
import {
  Container,
  Box,
  TextField,
  Typography,
  Button,
  Alert,
  Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { useTheme } from '@mui/material/styles';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const theme = useTheme();

    const autofillStyles = {
      '& input:-webkit-autofill': {
        WebkitBoxShadow: `0 0 0 1000px ${theme.palette.background.paper} inset`,
        WebkitTextFillColor: theme.palette.text.primary,
        transition: 'background-color 5000s ease-in-out 0s',
      },
    };
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const { user } = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      await updateProfile(user, {
        displayName: `${formData.firstName} ${formData.lastName}`
      });

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: "user",
        createdAt: Timestamp.now()
      });


      navigate('/login');
    } catch (err) {
      setError('❌ Rejestracja nie powiodła się. ' + err.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 8, p: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontFamily: 'Bebas Neue', mb: 2 }}>
          📝 Rejestracja
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Imię"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
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
            label="Nazwisko"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
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
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
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
            name="password"
            value={formData.password}
            onChange={handleChange}
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
            sx={{ backgroundColor: '#403433', '&:hover': { backgroundColor: '#D9B3B0', color: '#403433' } }}
          >
            ➕ Zarejestruj się
          </Button>
          <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
            Masz już konto?{" "}
            <Button
              variant="text"
              size="small"
              onClick={() => navigate("/login")}
              sx={{ textTransform: "none", fontWeight: 'bold' }}
            >
              Zaloguj się
            </Button>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
