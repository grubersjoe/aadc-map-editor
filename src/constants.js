import { createMuiTheme } from 'material-ui/styles/index';
import { blueGrey, cyan } from 'material-ui/colors';

export const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: blueGrey[700],
    },
    secondary: {
      main: cyan[400],
    },
  },
});

export const foo = 'bar';
