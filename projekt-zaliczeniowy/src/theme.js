import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#403433' },
    secondary: { main: '#D9B3B0' },
    background: { default: '#F2D7D0', paper: '#ffffff' },
    text: { primary: '#59514F', secondary: '#737272' },
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

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#BF416F",     
    },
    secondary: {
      main: "#D99AB1",     
    },
    background: {
      default: "#2B2024",  
      paper: "#3A2931",     
    },
    text: {
      primary: "#FDF5F6",  
      secondary: "#BF6989", 
    },
    info: {
      main: "#595048",     
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
export default lightTheme;