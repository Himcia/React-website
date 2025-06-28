import { GlobalStyles } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export default function CalendarGlobalStyles() {
  const theme = useTheme();

  const isDark = theme.palette.mode === 'dark';

  return (
    <GlobalStyles
      styles={{
        body: {
          fontFamily: "'Merriweather', serif",
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
        },

        '.fc': {
          fontFamily: "'Merriweather', serif",
          backgroundColor: 'transparent',
          color: theme.palette.text.primary,
        },

        '.fc-toolbar-title': {
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '1.8rem',
          color: theme.palette.text.primary,
        },

        '.fc .fc-button': {
          backgroundColor: theme.palette.primary.main,
          color: '#fff',
          borderRadius: '8px',
          fontFamily: "'Merriweather', serif",
          fontSize: '0.9rem',
          border: '2px solid',
          borderColor: theme.palette.primary.main,
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          textTransform: 'none',
        },

        '.fc .fc-button:hover': {
          backgroundColor: theme.palette.secondary.main,
          color: theme.palette.primary.main,
          borderColor: theme.palette.secondary.main,
          transform: 'scale(1.05)',
        },
        '.fc .fc-button:focus, .fc .fc-button.fc-button-active': {
            backgroundColor: `${isDark ? '#4D2433' : '#D9B3B0'} !important`,
            color: `${isDark ? '#fff' : '#403433'} !important`,
            borderColor: `${isDark ? '#BF416F' : '#403433'} !important`,
            boxShadow: 'inset 0 0 0 2px rgba(0,0,0,0.2) !important',
            transform: 'scale(0.98) !important',
            transition: 'all 0.2s ease-in-out !important',
        },
        '.fc .fc-button.fc-button-active': {
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.primary.main,
            borderColor: theme.palette.secondary.main,
            transform: 'scale(1.05)',
            transition: 'all 0.2s ease-in-out',
            fontWeight: 600,
        },

        '.fc .fc-today-button': {
            backgroundColor: `${theme.palette.primary.main} !important`,
            color: '#fff !important',
            borderRadius: '8px',
            fontFamily: "'Merriweather', serif",
            fontSize: '0.9rem',
            border: '2px solid',
            borderColor: `${theme.palette.primary.main} !important`,
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            textTransform: 'none',
            fontWeight: 500,
            transition: 'all 0.2s ease-in-out',
        },

        '.fc .fc-today-button:hover': {
            backgroundColor: `${theme.palette.secondary.main} !important`,
            color: `${theme.palette.primary.main} !important`,
            borderColor: `${theme.palette.secondary.main} !important`,
            transform: 'scale(1.05)',
        },

        '.fc .fc-scrollgrid': {
          border: `1px solid ${isDark ? '#732E4C' : '#403433'}`,
          borderRadius: '4px',
        },

        '.fc td, .fc th': {
          borderColor: isDark ? '#732E4C' : '#403433',
          borderWidth: '1px',
          borderStyle: 'solid',
          transition: 'border-color 0.3s ease',
        },

        '.fc .fc-col-header': {
          borderTop: `1px solid ${isDark ? '#732E4C' : '#403433'}`,
          borderBottom: `1px solid ${isDark ? '#732E4C' : '#403433'}`,
          borderLeft: 0,
          borderRight: 0,
        },

        '.fc .fc-col-header-cell': {
          backgroundColor: `${isDark ? '#BF6989' : '#D9B3B0'} !important`,
          color: `${isDark ? '#fff' : '#403433'} !important`,
          borderBottom: `1px solid ${isDark ? '#4D2433' : '#403433'} !important`,
          borderColor: `${isDark ? '#732E4C' : '#403433'} !important`,
          fontWeight: 600,
        },

        '.fc .fc-scrollgrid-section-header td': {
          borderBottom: `1px solid ${isDark ? '#732E4C' : '#403433'}`,
        },

        '.fc-daygrid-day.fc-day-today': {
          backgroundColor: `${isDark ? '#BF6989' : 'rgba(217,179,176,0.2)'} !important`,
          color: `${isDark ? '#fff' : theme.palette.text.primary}`,
          borderRadius: '6px',
        },

        '.fc-event': {
          backgroundColor: theme.palette.primary.main,
          color: '#fff',
          border: 'none',
          fontWeight: 500,
        },
      }}
    />
  );
}
