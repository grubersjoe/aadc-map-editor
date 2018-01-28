import React from 'react';
import PropTypes from 'prop-types';
import { withTheme } from 'material-ui/styles';

const Cursor = ({
  x, y, bounds, tileSize, animate, theme
}) => {
  const style = {
    position: 'absolute',
    width: tileSize,
    height: tileSize,
    left: (x * tileSize) - (bounds.xMin * tileSize),
    bottom: (y * tileSize) - (bounds.yMin * tileSize),
    transition: animate ? 'all .15s' : 'none',
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
    zIndex: 100,
  };

  return (
    <div id="Cursor" style={style}>x: {x}<br />y: {y}</div>
  );
};

Cursor.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  bounds: PropTypes.objectOf(PropTypes.number).isRequired,
  tileSize: PropTypes.number,
  animate: PropTypes.bool,
};

Cursor.defaultProps = {
  x: 0,
  y: 0,
  tileSize: 50,
  animate: true,
};

export default withTheme()(Cursor);
