import { createTheme } from '@mui/material/styles';
import { orange } from '@mui/material/colors';

declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: string;
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
}

export const Theme = createTheme({
  status: {
    danger: orange[500],
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#004a6e',
      light: '#004a6e',
      dark: '#5c5c5c',
    },
    secondary: {
      main: '#f6d816',
      light: '#f6d816',
      dark: '#5c5c5c',
    }
  },
});