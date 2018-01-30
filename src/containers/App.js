import React, { Component } from 'react';
import { Reboot, MuiThemeProvider } from 'material-ui';

import { theme } from '../constants';
import Map from './Map';
import MenuBar from './MenuBar';

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
      xMax: 15,
      yMax: 9,
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

    return (
      <MuiThemeProvider theme={theme}>
        <Reboot />
        <MenuBar
          bounds={bounds}
          setAppState={this.setAppState}
        />
        <Map
          cursorX={x}
          cursorY={y}
          bounds={bounds}
          setAppState={this.setAppState}
        />
      </MuiThemeProvider>
    );
  };
}

export default App;

