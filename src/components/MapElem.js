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
  let imgSrc;

  if (!imgMeta) {
    console.warn(`Unable to render <${elemType}> with type id ${type}`);
    return '';
  }

  try {
    imgSrc = require(`../images/${elemType}/${type}.svg`);
  } catch (e) {
    console.error(e.message);
    return '';
  }

  const styles = {
    position: 'absolute',
    width: tileSize * imgMeta.size,
    height: tileSize * imgMeta.size,
    left: (x * tileSize) - (xMin * tileSize),
    bottom: (y * tileSize) - (yMin * tileSize),
    transform: `rotate(${degXmlToCss(elemType, dir)}deg)`,
    backgroundColor: elemType === XmlTags.TILE ? `hsla(${type * 360 / 8}, 70%, 50%, 0.8)` : 'none',
  };

  return (
    <div style={styles}>
      <img src={imgSrc} title={imgMeta.title} alt={`Map elem at ${x}/${y}`} />
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
