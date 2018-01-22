import React from 'react';
import PropTypes from 'prop-types';
import './Cursor.css';
import { MIN_X, MIN_Y } from './Map';

const Cursor = ({
  x, y, tileSize, animate,
}) => {
  const style = {
    width: tileSize,
    height: tileSize,
    left: (x * tileSize) - (MIN_X * tileSize),
    bottom: (y * tileSize) - (MIN_Y * tileSize),
    transition: animate ? 'all .15s' : 'none',
  };

  return (
    <div id="Cursor" style={style}>x: {x}<br />y: {y}</div>
  );
};

Cursor.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  tileSize: PropTypes.number,
  animate: PropTypes.bool,
};

Cursor.defaultProps = {
  x: 0,
  y: 0,
  tileSize: 50,
  animate: true,
};

export default Cursor;
