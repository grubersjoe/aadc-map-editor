import { createMuiTheme } from 'material-ui/styles/index';
import { blueGrey, cyan } from 'material-ui/colors';

export default createMuiTheme({
  common: {
    white: '#fff',
  },
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
