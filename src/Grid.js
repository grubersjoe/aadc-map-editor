import React from 'react';
import PropTypes from 'prop-types';

const Grid = ({
  tileSize = 50,
  strokeColor = '#ddd',
  strokeWidth = 2,
}) => (
  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="grid-pattern" width={tileSize} height={tileSize} patternUnits="userSpaceOnUse" fill="transparent">
        <rect width={tileSize} height={tileSize} fill="url(#smallGrid)" />
        <path d={`M ${tileSize} 0 L 0 0 0 ${tileSize}`} fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid-pattern)" />
  </svg>
);

Grid.propTypes = {
  tileSize: PropTypes.number.isRequired,
  strokeColor: PropTypes.string,
  strokeWidth: PropTypes.number,
};

Grid.defaultProps = {
  strokeColor: '#ddd',
  strokeWidth: 2,
};

export default Grid;
