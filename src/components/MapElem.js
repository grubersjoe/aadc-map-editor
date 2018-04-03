import React from 'react';
import PropTypes from 'prop-types';

import { MapElemsMeta } from '../images';
import { XmlTags } from '../services/XmlLoader';
import { DEBUG } from '../config';

export const MapElemType = {
  UNKNOWN: -1,
  STRAIGHT: 1,
  T_CROSSING: 2,
  PLUS_CROSSING: 3,
  LARGE_TURN: 4,
  SMALL_TURN: 5,
  S_TURN_RIGHT: 7,
  S_TURN_LEFT: 8,
};

export const MapElemOrigin = {
  FILE: 'file',
  EDITOR: 'editor',
};

const MapElem = (props) => {
  const {
    tileSize, x, y, xMin, yMin, dir, type, elemType,
  } = props;

  const elemMeta = (elemType === XmlTags.TILE || elemType === XmlTags.ROAD_SIGN) ?
    MapElemsMeta[elemType][type] :
    MapElemsMeta[elemType];

  if (!elemMeta) {
    if (DEBUG) {
      console.warn(`Unable to render <${elemType}> with type id ${type}`);
    }
    return '';
  }

  let imgSrc;
  try {
    if (elemType === XmlTags.TILE || elemType === XmlTags.ROAD_SIGN) {
      imgSrc = require(`../images/${elemType}/${type}.svg`);
    } else {
      imgSrc = require(`../images/other/${elemType}.svg`);
    }
  } catch (e) {
    imgSrc = require('../images/other/fallback.svg');
    elemMeta.title = `Unknown sign with type id ${type}`;
    if (DEBUG) {
      console.warn(`${e.message} Using fallback.`);
    }
  }

  const elemSize = tileSize * elemMeta.size;
  let posX = (x * tileSize) - (xMin * tileSize);
  let posY = (y * tileSize) - (yMin * tileSize);
  const zIndex = elemType === XmlTags.TILE ? 100 : 200;

  // Center the object around set position (base position is bottom left)
  if (elemType === XmlTags.ROAD_SIGN || elemType === XmlTags.PEDESTRIAN_CROSSING) {
    posX -= elemSize / 2;
    posY -= elemSize / 2;
  }

  const styles = {
    root: {
      position: 'absolute',
      width: elemSize,
      height: elemSize,
      left: posX,
      bottom: posY,
      transform: `rotate(${dir}deg)`,
      backgroundColor: elemType === XmlTags.TILE ? `hsla(${type * 360 / 8}, 70%, 50%, 0.8)` : 'none',
      zIndex,
    },
    img: {
      width: '100%',
      height: 'auto',
    },
  };

  return (
    <div style={styles.root}>
      <img style={styles.img} src={imgSrc} title={elemMeta.title} alt={`Map elem at ${x}/${y}`} />
    </div>
  );
};

MapElem.propTypes = {
  tileSize: PropTypes.number.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  xMin: PropTypes.number.isRequired,
  yMin: PropTypes.number.isRequired,
  type: PropTypes.number.isRequired,
  elemType: PropTypes.string.isRequired,
  dir: PropTypes.number,
};

MapElem.defaultProps = {
  dir: 0,
};

export default MapElem;
