import React, { Component } from 'react';
import { createMuiTheme, MuiThemeProvider } from 'material-ui/styles';
import { Reboot } from 'material-ui';

import Map from './Map';
import MenuBar from './MenuBar';
import NumericInput from '../components/NumericInput';

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

// eslint-disable-next-line react/prefer-stateless-function
class App extends Component {
  state = {
    cursor: {
      x: 0,
      y: 0,
    },
    bounds: {
      xMin: -1,
      yMin: -1,
      xMax: 11,
      yMax: 7,
    },
  };

  setAppState = (data) => {
    let state = {};
    Object.keys(data).forEach((key) => {
      Object.assign(state, {
        [key]: Object.assign(this.state[key], data[key]),
      });
    });

    this.setState(state);
  };

  render = () => {
    const { x, y } = this.state.cursor;
    const { bounds } = this.state;

    const width = bounds.xMax - bounds.xMin;
    const height = bounds.yMax - bounds.yMin;

    return (
      <MuiThemeProvider theme={theme}>
        <Reboot />
        <MenuBar />
        <Map
          cursorX={x}
          cursorY={y}
          bounds={bounds}
          setAppState={this.setAppState}
        />
        <div style={{ position: 'fixed', bottom: '0' }}>
          <span>{x} / {y}</span>
          <NumericInput
            size={3}
            min={2}
            max={50}
            value={width}
            onChange={(numericVal) => {
              this.setAppState({
                bounds: { xMax: numericVal + bounds.xMin },
              });
            }}
          />

          <NumericInput
            size={3}
            min={2}
            max={50}
            value={height}
            onChange={(numericVal) => {
              this.setAppState({
                bounds: { yMax: numericVal + bounds.yMin },
              });
            }}
          />
        </div>
      </MuiThemeProvider>
    );
  };
}

export default App;

