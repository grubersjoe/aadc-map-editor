import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Cursor from '../components/Cursor';
import Grid from '../components/Grid';

class Map extends Component {
  componentDidMount = () => {
    window.addEventListener('keydown', this.onKeydown);
  };

  onKeydown = (ev) => {
    if (document.activeElement instanceof HTMLInputElement) {
      return;
    }

    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(ev.key)) {
      ev.preventDefault();
    }

    switch (ev.key) {
      case 'ArrowUp':
        ev.preventDefault();
        this.moveCursor(0, 1);
        break;
      case 'ArrowDown':
        ev.preventDefault();
        this.moveCursor(0, -1);
        break;
      case 'ArrowLeft':
        ev.preventDefault();
        this.moveCursor(-1, 0);
        break;
      case 'ArrowRight':
        ev.preventDefault();
        this.moveCursor(1, 0);
        break;
      default:
    }
  };

  moveCursor = (xOffset = 0, yOffset = 0) => {
    const { bounds } = this.props;

    const x = this.props.cursorX + xOffset;
    const y = this.props.cursorY + yOffset;

    if (x < bounds.xMin || y < bounds.yMin) {
      return;
    }

    const xMax = x === bounds.xMax ? x + 1 : bounds.xMax;
    const yMax = y === bounds.yMax ? y + 1 : bounds.yMax;

    this.props.setAppState({
      cursor: { x, y },
      bounds: { xMax, yMax },
    });
  };

  // scaleMap = (tileSize) => {
  //   animate = false;
  //   this.setState({ tileSize }, () => {
  //     animate = true;
  //   });
  // };

  render = () => {
    const {
      tileSize, bounds, cursorX, cursorY, ui,
    } = this.props;

    const width = bounds.xMax - bounds.xMin;
    const height = bounds.yMax - bounds.yMin;

    const mapStyle = {
      position: 'absolute',
      top: 64,
      left: 0,
      width: (width * tileSize) + 1,
      height: (height * tileSize) + 1,
      transition: ui.animate ? 'all .15s' : 'none',
    };
    return (
      <div id="Map" style={mapStyle}>
        {ui.grid && <Grid tileSize={tileSize} />}
        <Cursor
          x={cursorX}
          y={cursorY}
          bounds={bounds}
          tileSize={tileSize}
          animate={ui.animate}
        />
      </div>
    );
  };
}

Map.defaultProps = {
  cursorX: 0,
  cursorY: 0,
  ui: {
    grid: true,
  },
};

Map.propTypes = {
  cursorX: PropTypes.number,
  cursorY: PropTypes.number,
  bounds: PropTypes.object.isRequired,
  tileSize: PropTypes.number.isRequired,
  setAppState: PropTypes.func.isRequired,
  ui: PropTypes.object,
};

export default Map;
