import React, { Component } from 'react';
import Cursor from './Cursor.js';
import Grid from './Grid.js';
import './Map.css';

// const KEY = {
//   LEFT:  37,
//   RIGHT: 39,
//   UP: 38,
// };

class Map extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tileSize: 50,
      width: 12,
      height: 12,
      cursor: {
        x: 0,
        y: 0,
        animate: true,
      },
      bounds: {
        minX: 0,
        minY: 0,
        maxX: 15,
        maxY: 15,
      }
    };
  }

  render = () => {
    window.addEventListener('keydown', this.handleKeys);

    // eslint-disable-next-line
    const { cursor, width, height, tileSize } = this.state;
    const absWidth = width * tileSize + 1;
    const absHeight = height * tileSize + 1;

    const mapStyle = {
      width: absWidth + 'px',
      height: absHeight + 'px',
    };

    return (
      <div className="Map" style={mapStyle}>
        <Grid tileSize={tileSize} />
        <Cursor x={this.state.cursor.x} y={this.state.cursor.y} tileSize={tileSize} />

        <input type="number" step="1" value={width} onChange={(e) => this.setState({
          width: Number.parseInt(e.target.value, 10),
        })} />

        <input type="number" step="1" value={height} onChange={(e) => this.setState({
          height: Number.parseInt(e.target.value, 10),
        })} />

        <input type="number" step="10" onChange={(e) => this.setState({
          tileSize: Number.parseInt(e.target.value, 10),
        })} value={tileSize} />
      </div>
    );
  }

  handleKeys = (event) => {
    if (document.activeElement instanceof HTMLInputElement) {
      return;
    }

    switch (event.key) {
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
        return;
    }
  }

  moveCursor = (xOffset = 0, yOffset = 0) => {
    const { bounds, cursor } = this.state;
    const x = cursor.x + xOffset;
    const y = cursor.y + yOffset;

    if (x < bounds.minX || y < bounds.minY) {
      return;
    }

    this.setCursor(x, y);
  }

  setCursor = (x, y) => {
    this.setState({
      cursor: Object.assign(this.state.cursor, { x, y })
    });
  }

  handleTileSize = (event) => {
    this.setState({ tileSize: event.target.value });
  }

  componentDidMount() {
    this.setCursor(0, 0);
  }
}

export default Map;
