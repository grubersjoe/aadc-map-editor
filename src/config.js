import { createMuiTheme } from 'material-ui/styles/index';
import { blueGrey, cyan, red } from 'material-ui/colors';

export const DEBUG = false;

export const THEME = createMuiTheme({
  common: {
    white: '#fff',
  },
  palette: {
    type: 'light',
    primary: {
      main: blueGrey[800],
      contrastText: '#fff',
    },
    secondary: {
      main: cyan.A700,
      contrastText: '#fff',
    },
    error: {
      main: red[800],
      contrastText: '#fff',
    },
  },
});
