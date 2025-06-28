// theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#403433',
    },
    secondary: {
      main: '#D9B3B0',
    },
    background: {
      default: '#F2D7D0',
      paper: '#ffffff',
    },
    text: {
      primary: '#59514F',
      secondary: '#737272',
    },
  },
 typography: {
    fontFamily: '"Merriweather", serif',
    h1: { fontFamily: '"Bebas Neue", sans-serif' },
    h2: { fontFamily: '"Bebas Neue", sans-serif' },
    h3: { fontFamily: '"Bebas Neue", sans-serif' },
    h4: { fontFamily: '"Bebas Neue", sans-serif' },
    h5: { fontFamily: '"Bebas Neue", sans-serif' },
    h6: { fontFamily: '"Bebas Neue", sans-serif' },
  },
});

export default theme;