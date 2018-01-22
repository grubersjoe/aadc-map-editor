import React, { Component } from 'react';
import NumericInput from 'react-numeric-input';

import Cursor from './Cursor.js';
import Grid from './Grid.js';
import './Map.css';

// const KEY = {
//   LEFT:  37,
//   RIGHT: 39,
//   UP: 38,
// };

const MIN_X = -1;
const MIN_Y = -1;

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
        maxX: 5,
        maxY: 5,
      }
    };
  }

  render = () => {
    window.addEventListener('keydown', this.handleKeys);

    // eslint-disable-next-line
    const { bounds, tileSize, grid, cursor } = this.state;

    const width = bounds.maxX - MIN_X;
    const height = bounds.maxY - MIN_Y;

    const mapStyle = {
      width: width * tileSize + 1,
      height: height * tileSize + 1,
      transition: animate ? 'all .15s' : 'none',
    };

    return (
      <div id="Map" style={mapStyle}>
        <Grid tileSize={tileSize} />
        <Cursor x={cursor.x} y={cursor.y} tileSize={tileSize} animate={animate} />

        <NumericInput
          min={-1}
          max={50}
          value={width}
          onChange={numericVal => {
            this.setState({
              bounds: Object.assign(bounds, { maxX: numericVal - 1 })
            })
          }}
        />

        <NumericInput
          min={-1}
          max={50}
          value={height}
          onChange={numericVal => {
            this.setState({
              bounds: Object.assign(bounds, { maxY: numericVal - 1 })
            })
          }}
        />

        <NumericInput
          min={20}
          max={150}
          value={tileSize}
          parse={Number.parseInt}
          step={10}
          format={num => num + '%'}
          onChange={this.scaleMap}
        />
      </div>
    );
  }

  handleKeys = (ev) => {
    if (document.activeElement instanceof HTMLInputElement) {
      return;
    }

    switch (ev.key) {
      case 'ArrowUp':
        return this.moveCursor(0, 1);
      case 'ArrowDown':
        return this.moveCursor(0, -1);
      case 'ArrowLeft':
        return this.moveCursor(-1, 0);
      case 'ArrowRight':
        return this.moveCursor(1, 0);
      default:
        return;
    }
  }

  scaleMap = (tileSize) => {
    animate = false;
    this.setState({ tileSize }, () => {
      animate = true;
    });
  }

  moveCursor = (xOffset = 0, yOffset = 0) => {
    const { bounds, cursor } = this.state;

    const x = cursor.x + xOffset;
    const y = cursor.y + yOffset;

    if (x < MIN_X || y < MIN_Y) {
      return;
    }

    // enlarge map if necessary
    this.setState({
      bounds: Object.assign(bounds, {
        maxX: x === bounds.maxX ? x + 1 : bounds.maxX,
        maxY: y === bounds.maxY ? y + 1 : bounds.maxY,
      })
    });

    this.setCursor(x, y);
  }

  setCursor = (x, y) => {
    this.setState({
      cursor: Object.assign(this.state.cursor, { x, y })
    });
  }

  componentDidMount() {
    this.setCursor(0, 0);
  }
}

export default Map;
