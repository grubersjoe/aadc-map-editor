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
    tileSize: 50,
    ui: {
      animate: true,
      grid: true,
    },
  };

  setAppState = (data, callback) => {
    const changes = {};
    Object.keys(data).forEach((key) => {
      if (typeof data[key] === 'object') {
        Object.assign(changes, {
          [key]: Object.assign(this.state[key], data[key]),
        });
      } else {
        Object.assign(changes, {
          [key]: data[key],
        });
      }
    });

    this.setState(changes, callback);
  };

  render = () => {
    const { x, y } = this.state.cursor;
    const { bounds, ui, tileSize } = this.state;

    return (
      <MuiThemeProvider theme={theme}>
        <Reboot />
        <MenuBar
          bounds={bounds}
          tileSize={tileSize}
          ui={ui}
          setAppState={this.setAppState}
        />
        <Map
          cursorX={x}
          cursorY={y}
          bounds={bounds}
          tileSize={tileSize}
          setAppState={this.setAppState}
          ui={ui}
        />
      </MuiThemeProvider>
    );
  };
}

export default App;

