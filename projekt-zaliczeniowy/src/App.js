import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import { useAuth } from "./context/AuthContext";
import CalendarView from "./Components/CalendarView";
import { useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from './theme';
import ThemeToggle from './Components/ThemeToggle';

function App() {
  const [mode, setMode] = useState('light');
  const { user } = useAuth();

  useEffect(() => {
    const saved = localStorage.getItem('appTheme');
    if (saved === 'dark') setMode('dark');
  }, []);

  const theme = mode === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0.5rem 1rem' }}>
        <ThemeToggle mode={mode} setMode={setMode} />
      </div>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/admin" element={user?.role === "admin" ? <AdminPanel /> : <Navigate to="/" />} />
        <Route path="/calendar" element={user ? <CalendarView /> : <Navigate to="/" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
