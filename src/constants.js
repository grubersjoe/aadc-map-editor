import { createMuiTheme } from 'material-ui/styles/index';
import { blueGrey, cyan } from 'material-ui/colors';

export const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: blueGrey[800],
      contrastText: '#fff',
    },
    secondary: {
      main: cyan.A700,
      contrastText: '#fff',
    },
  },
});

export const foo = 'bar';
