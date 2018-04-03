import React from 'react';
import PropTypes from 'prop-types';

import Cursor from './Cursor';
import Grid from './Grid';
import MapElem from './MapElem';

const Map = (props) => {
  const {
    mapElems, bounds, tileSize, cursor, ui,
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
      <Grid tileSize={tileSize} visible={ui.grid} />
      <Cursor
        x={cursor.x}
        y={cursor.y}
        xMin={bounds.xMin}
        yMin={bounds.yMin}
        tileSize={tileSize}
        animate={ui.animate}
      />

      {
        mapElems
          .filter((elem) => {
            let draw = false;
            Object.keys(ui).forEach((type) => {
              draw = draw || (ui[type] && elem.elemType === type);
            });
            return draw;
          })
          .map((tile) => {
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
  cursor: {
    x: 0,
    y: 0,
  },
  ui: {
    grid: true,
  },
};

Map.propTypes = {
  mapElems: PropTypes.arrayOf(PropTypes.object).isRequired,
  cursor: PropTypes.object,
  bounds: PropTypes.object.isRequired,
  tileSize: PropTypes.number.isRequired,
  ui: PropTypes.object,
};

export default Map;
