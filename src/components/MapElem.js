import React from 'react';
import PropTypes from 'prop-types';

import { MapElemsMeta } from '../images';
import { degXmlToCss } from '../util/style';
import { XmlTags } from '../services/XmlLoader';

const MapElem = (props) => {
  const {
    tileSize, x, y, xMin, yMin, dir, type, elemType,
  } = props;

  const imgMeta = MapElemsMeta[elemType][type];

  if (!imgMeta) {
    console.warn(`Unable to render <${elemType}> with type id ${type}`);
    return '';
  }

  let imgSrc;
  try {
    imgSrc = require(`../images/${elemType}/${type}.svg`);
  } catch (e) {
    imgSrc = require('../images/fallback.svg');
    imgMeta.title = `Unknown sign with type id ${type}`;
    console.warn(e.message + ' Using fallback.');
  }

  const elemSize = tileSize * imgMeta.size;
  let posX = (x * tileSize) - (xMin * tileSize);
  let posY = (y * tileSize) - (yMin * tileSize);

  if (elemType !== 'tile') {
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
      transform: `rotate(${degXmlToCss(elemType, dir)}deg)`,
      backgroundColor: elemType === XmlTags.TILE ? `hsla(${type * 360 / 8}, 70%, 50%, 0.8)` : 'none',
    },
    img: {
      width: '100%',
      height: 'auto',
    },
  };

  return (
    <div style={styles.root}>
      <img style={styles.img} src={imgSrc} title={imgMeta.title} alt={`Map elem at ${x}/${y}`} />
    </div>
  );
};

MapElem.propTypes = {
  // theme: PropTypes.object.isRequired,
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
