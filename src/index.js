import React from 'react';
import ReactDOM from 'react-dom';
import { createMuiTheme, MuiThemeProvider } from 'material-ui/styles';

// eslint-disable-next-line import/extensions
import 'typeface-roboto';
import './index.css';

import Map from './containers/Map';
import registerServiceWorker from './registerServiceWorker';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#48a999',
      main: '#00796b',
      dark: '#004c40',
      contrastText: '#fff',
    },
    secondary: {
      light: '#5df2d6',
      main: '#00bfa5',
      dark: '#008e76',
      contrastText: '#000',
    },
  },
});


ReactDOM.render(<MuiThemeProvider theme={theme}><Map /></MuiThemeProvider>, document.getElementById('root'));
registerServiceWorker();
