import React from 'react';
import PropTypes from 'prop-types';
import { withTheme } from 'material-ui';

const Cursor = (props) => {
  const {
    theme, x, y, xMin, yMin, tileSize, animate,
  } = props;
  const cursorStyle = {
    position: 'absolute',
    width: tileSize,
    height: tileSize,
    left: (x * tileSize) - (xMin * tileSize),
    bottom: (y * tileSize) - (yMin * tileSize),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
    fontSize: tileSize / 5,
    fontWeight: 500,
    transition: animate ? 'left .1s, bottom .1s' : 'none',
    willChange: 'left, bottom',
    opacity: 0.85,
    zIndex: 1000,
  };


  return (
    <div id="Cursor" style={cursorStyle}>{x}&nbsp;/&nbsp;{y}</div>
  );
};

Cursor.propTypes = {
  theme: PropTypes.object.isRequired,
  x: PropTypes.number,
  y: PropTypes.number,
  xMin: PropTypes.number.isRequired,
  yMin: PropTypes.number.isRequired,
  tileSize: PropTypes.number.isRequired,
  animate: PropTypes.bool,
};

Cursor.defaultProps = {
  x: 0,
  y: 0,
  animate: true,
};

export default withTheme()(Cursor);
