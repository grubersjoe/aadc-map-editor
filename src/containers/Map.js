import React, { Component } from 'react';
import { Reboot, Button } from 'material-ui';

import NumericInput from '../components/NumericInput';
import Cursor from '../components/Cursor';
import Grid from '../components/Grid';

// const KEY = {
//   LEFT:  37,
//   RIGHT: 39,
//   UP: 38,
// };

let animate = true;

class Map extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tileSize: 50,
      cursor: {
        x: 0,
        y: 0,
      },
      bounds: {
        xMin: -1,
        yMin: -1,
        xMax: 5,
        yMax: 5,
      },
    };
  }

  componentDidMount() {
    this.setCursor(0, 0);
  }

  setCursor = (x, y) => {
    this.setState({
      cursor: Object.assign(this.state.cursor, { x, y }),
    });
  };

  moveCursor = (xOffset = 0, yOffset = 0) => {
    const { bounds, cursor } = this.state;

    const x = cursor.x + xOffset;
    const y = cursor.y + yOffset;

    if (x < bounds.xMin || y < bounds.yMin) {
      return;
    }

    this.setState({
      bounds: Object.assign(bounds, {
        xMax: x === bounds.xMax ? x + 1 : bounds.xMax,
        yMax: y === bounds.yMax ? y + 1 : bounds.yMax,
      }),
    });

    this.setCursor(x, y);
  };

  scaleMap = (tileSize) => {
    animate = false;
    this.setState({ tileSize }, () => {
      animate = true;
    });
  };

  handleKeys = (ev) => {
    if (document.activeElement instanceof HTMLInputElement) {
      return;
    }

    switch (ev.key) {
      case 'ArrowUp':
        this.moveCursor(0, 1);
        break;
      case 'ArrowDown':
        this.moveCursor(0, -1);
        break;
      case 'ArrowLeft':
        this.moveCursor(-1, 0);
        break;
      case 'ArrowRight':
        this.moveCursor(1, 0);
        break;
      default:
    }
  };

  render = () => {
    window.addEventListener('keydown', this.handleKeys);

    // eslint-disable-next-line
    const { bounds, tileSize, cursor } = this.state;

    const width = bounds.xMax - bounds.xMin;
    const height = bounds.yMax - bounds.yMin;

    const mapStyle = {
      position: 'absolute',
      top: 0,
      left: 0,
      width: (width * tileSize) + 1,
      height: (height * tileSize) + 1,
      transition: animate ? 'all .15s' : 'none',
    };

    return (
      <div id="Map" style={mapStyle}>
        <Reboot/>
        <Grid tileSize={tileSize}/>
        <Cursor x={cursor.x} y={cursor.y} bounds={bounds} tileSize={tileSize} animate={animate}/>

        <Button raised color="primary">
          Hello World
        </Button>

        <NumericInput
          size={2}
          min={2}
          max={50}
          value={width}
          onChange={(numericVal) => {
            this.setState({
              bounds: Object.assign(bounds, { xMax: numericVal + bounds.xMin }),
            });
          }}
        />

        <NumericInput
          size={2}
          min={2}
          max={50}
          value={height}
          onChange={(numericVal) => {
            this.setState({
              bounds: Object.assign(bounds, { yMax: numericVal + bounds.yMin }),
            });
          }}
        />

        <NumericInput
          size={4}
          min={20}
          max={150}
          value={tileSize}
          parse={Number.parseInt}
          step={10}
          format={num => `${num}%`}
          onChange={this.scaleMap}
        />
      </div>


    );
  }
}

export default Map;
