import { useEffect, useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4'; // 🌙
import Brightness7Icon from '@mui/icons-material/Brightness7'; // ☀️

export default function ThemeToggle({ mode, setMode }) {
  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('appTheme', newMode);
  };

  return (
    <Tooltip title={`Przełącz na tryb ${mode === 'light' ? 'ciemny' : 'jasny'}`}>
      <IconButton color="inherit" onClick={toggleTheme}>
        {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
      </IconButton>
    </Tooltip>
  );
}
