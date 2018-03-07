import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Cursor from './Cursor';
import Grid from './Grid';
import MapElem from './MapElem';

const Map = (props) => {
  const {
    mapElems, bounds, tileSize, cursorX, cursorY, ui,
  } = props;

  const width = bounds.xMax - bounds.xMin;
  const height = bounds.yMax - bounds.yMin;

  const styles = {
    position: 'absolute',
    top: 64,
    left: 0,
    width: (width * tileSize) + 1,
    height: (height * tileSize) + 1,
    transition: ui.animate ? 'all .15s' : 'none',
  };

  return (
    <div id="Map" style={styles}>
      {ui.grid && <Grid tileSize={tileSize} />}
      <Cursor
        x={cursorX}
        y={cursorY}
        xMin={bounds.xMin}
        yMin={bounds.yMin}
        tileSize={tileSize}
        animate={ui.animate}
      />

      {
        mapElems.map((tile) => {
          const {
            x, y, dir, type, elemType, key,
          } = tile;

          return (
            <MapElem
              tileSize={tileSize}
              x={x}
              y={y}
              xMin={bounds.xMin}
              yMin={bounds.yMin}
              dir={dir}
              type={type}
              elemType={elemType}
              key={key}
            />
          );
        })
      }
    </div>
  );
};

Map.defaultProps = {
  cursorX: 0,
  cursorY: 0,
  ui: {
    grid: true,
  },
};

Map.propTypes = {
  mapElems: PropTypes.arrayOf(PropTypes.object).isRequired,
  cursorX: PropTypes.number,
  cursorY: PropTypes.number,
  bounds: PropTypes.object.isRequired,
  tileSize: PropTypes.number.isRequired,
  ui: PropTypes.object,
};

export default Map;
