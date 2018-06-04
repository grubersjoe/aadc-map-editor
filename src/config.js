import { createMuiTheme } from '@material-ui/core/styles';
import { blueGrey, cyan, pink } from '@material-ui/core/colors';

export const DEBUG = false;

export const DEFAULTS = {
  xMax: 15,
  yMax: 9,
  tileSize: 70,
};

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
      main: pink[800],
      contrastText: '#fff',
    },
  },
});
