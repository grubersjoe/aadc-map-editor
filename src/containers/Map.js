import React, { Component } from 'react';
import PropTypes from 'prop-types';

import NumericInput from '../components/NumberInput';
import Cursor from '../components/Cursor';
import Grid from '../components/Grid';

let animate = true;

class Map extends Component {
  state = {
    tileSize: 50,
  };

  componentDidMount = () => {
    window.addEventListener('keydown', this.onKeydown);
  };

  onKeydown = (ev) => {
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

  scaleMap = (tileSize) => {
    animate = false;
    this.setState({ tileSize }, () => {
      animate = true;
    });
  };

  render = () => {
    const { tileSize } = this.state;
    const { ui, bounds, cursorX, cursorY } = this.props;

    const width = bounds.xMax - bounds.xMin;
    const height = bounds.yMax - bounds.yMin;

    const mapStyle = {
      position: 'absolute',
      top: 64,
      left: 0,
      width: (width * tileSize) + 1,
      height: (height * tileSize) + 1,
      transition: animate ? 'all .15s' : 'none',
    };
    return (
      <div id="Map" style={mapStyle}>
        { ui.grid && <Grid tileSize={tileSize} />}
        <Cursor
          x={cursorX}
          y={cursorY}
          bounds={bounds}
          tileSize={tileSize}
          animate={animate}
        />

        <NumericInput
          size={3}
          min={30}
          max={150}
          value={tileSize}
          parse={Number.parseInt}
          step={10}
          format={num => `${num}%`}
          onChange={this.scaleMap}
        />
      </div>
    );
  };
}

Map.defaultProps = {
  cursorX: 0,
  cursorY: 0,
};

Map.propTypes = {
  cursorX: PropTypes.number,
  cursorY: PropTypes.number,
  bounds: PropTypes.object.isRequired,
  setAppState: PropTypes.func.isRequired,
};

export default Map;
