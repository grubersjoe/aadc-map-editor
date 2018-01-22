import React from 'react';
import './Cursor.css';

const Cursor = ({x, y, tileSize, animate = true}) => {
  const style = {
    width: tileSize,
    height: tileSize,
    left: x * tileSize + tileSize,
    bottom: y * tileSize + tileSize,
    transition: animate ? 'all .15s' : 'none',
  };

  return (
    <div id="Cursor" style={style}>x: {x}<br/>y: {y}</div>
  )
};

export default Cursor;