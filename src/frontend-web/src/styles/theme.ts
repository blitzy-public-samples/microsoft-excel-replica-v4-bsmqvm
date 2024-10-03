import { createTheme, ThemeOptions } from '@mui/material/styles';

// Define custom color palette
const lightPalette = {
  primary: {
    main: '#0078D4', // Microsoft Blue
    light: '#50a3e7',
    dark: '#005299',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#107C10', // Green
    light: '#4ca64c',
    dark: '#0b5509',
    contrastText: '#FFFFFF',
  },
  error: {
    main: '#D13438',
    light: '#dc6c6e',
    dark: '#922326',
    contrastText: '#FFFFFF',
  },
  warning: {
    main: '#FFC83D',
    light: '#ffd970',
    dark: '#b28c2a',
    contrastText: '#000000',
  },
  info: {
    main: '#881798',
    light: '#a355af',
    dark: '#5f106a',
    contrastText: '#FFFFFF',
  },
  success: {
    main: '#107C10',
    light: '#4ca64c',
    dark: '#0b5509',
    contrastText: '#FFFFFF',
  },
  background: {
    default: '#FFFFFF',
    paper: '#F3F3F3',
  },
  text: {
    primary: '#252525',
    secondary: '#666666',
  },
};

const darkPalette = {
  ...lightPalette,
  background: {
    default: '#252525',
    paper: '#1F1F1F',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#CCCCCC',
  },
};

// Define custom typography
const typography = {
  fontFamily: '"Segoe UI", Arial, sans-serif',
  h1: {
    fontSize: '2.5rem',
    fontWeight: 600,
  },
  h2: {
    fontSize: '2rem',
    fontWeight: 600,
  },
  h3: {
    fontSize: '1.75rem',
    fontWeight: 600,
  },
  h4: {
    fontSize: '1.5rem',
    fontWeight: 600,
  },
  h5: {
    fontSize: '1.25rem',
    fontWeight: 600,
  },
  h6: {
    fontSize: '1rem',
    fontWeight: 600,
  },
  body1: {
    fontSize: '1rem',
  },
  body2: {
    fontSize: '0.875rem',
  },
};

// Define custom shadows
const shadows = [
  'none',
  '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
  '0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)',
  // ... Add more shadow definitions as needed
];

// Define custom shape
const shape = {
  borderRadius: 4,
};

// Define custom transitions
const transitions = {
  easing: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  },
  duration: {
    shortest: 150,
    shorter: 200,
    short: 250,
    standard: 300,
    complex: 375,
    enteringScreen: 225,
    leavingScreen: 195,
  },
};

// Define custom z-index values
const zIndex = {
  mobileStepper: 1000,
  speedDial: 1050,
  appBar: 1100,
  drawer: 1200,
  modal: 1300,
  snackbar: 1400,
  tooltip: 1500,
};

const createExcelTheme = (mode: 'light' | 'dark'): ThemeOptions => {
  const palette = mode === 'light' ? lightPalette : darkPalette;

  return createTheme({
    palette,
    typography,
    shadows,
    shape,
    transitions,
    zIndex,
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: palette.text.secondary,
              },
              '&:hover fieldset': {
                borderColor: palette.primary.main,
              },
              '&.Mui-focused fieldset': {
                borderColor: palette.primary.main,
              },
            },
          },
        },
      },
      // Add more component customizations as needed
    },
  });
};

export default createExcelTheme;