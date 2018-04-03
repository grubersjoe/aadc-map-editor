import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { AppBar, FormControlLabel, Toolbar, Typography } from 'material-ui';
import ClearIcon from 'material-ui-icons/Clear';
import { blueGrey } from 'material-ui/colors';

import NumberInput from './NumberInput';
import Switch from './Switch';

const styles = theme => ({
  root: {
    width: '100%',
  },
  flex: {
    flex: 1,
  },
  marginRight: {
    marginRight: theme.spacing.unit * 3,
  },
  input: {
    fontSize: 20,
    '&:hover:before': {
      backgroundColor: 'rgba(255, 255, 255, 0.9) !important',
    },
    '&:before': {
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    '&:after': {
      backgroundColor: '#ddd',
    },
  },
  cross: {
    position: 'relative',
    margin: '0 .5rem',
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  pos: {
    marginLeft: theme.spacing.unit * 4,
    marginRight: theme.spacing.unit * -3,
    padding: `0 ${theme.spacing.unit * 2}px`,
    backgroundColor: blueGrey[700],
    lineHeight: `${theme.spacing.unit * 8}px`,
    fontWeight: 'normal',
  },
});

const MenuBar = (props) => {
  const {
    classes, cursor, bounds, tileSize, ui, setAppState,
  } = props;
  const width = bounds.xMax - bounds.xMin;
  const height = bounds.yMax - bounds.yMin;

  return (
    <div id="app-bar" className={classes.root}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="title" color="inherit" className={classes.flex}>
            AADC Map Editor
          </Typography>

          <FormControlLabel
            control={
              <Switch
                checked={ui.grid}
                onChange={(event, checked) => {
                  setAppState({ ui: { grid: checked } });
                }}
              />
            }
            label="Grid"
            className={classes.marginRight}
          />

          <FormControlLabel
            control={
              <Switch
                checked={ui.animate}
                onChange={(event, checked) => {
                  setAppState({
                    ui: {
                      animate: checked,
                    },
                  });
                }}
              />
            }
            label="Animate"
            style={{
              marginRight: 0,
            }}
          />

          <NumberInput
            value={tileSize}
            size={4}
            min={20}
            max={500}
            step={10}
            format={num => `${num}%`}
            className={classes.input}
            style={{
              marginLeft: '2rem',
              marginRight: '2rem',
            }}
            onChange={(val) => {
              setAppState({
                tileSize: val,
              });
            }}
          />

          <NumberInput
            value={width}
            size={3.25}
            min={2}
            max={50}
            className={classes.input}
            onChange={val => setAppState({
              bounds: {
                xMax: val + bounds.xMin,
              },
            })}
          />

          <span className={classes.cross}>
            <ClearIcon />
          </span>

          <NumberInput
            value={height}
            size={3.25}
            min={2}
            max={50}
            className={classes.input}
            onChange={val => setAppState({
              bounds: {
                yMax: val + bounds.yMin,
              },
            })}
          />

          <Typography variant="title" color="inherit" className={classes.pos}>
            <span title="X">{String(cursor.x).padStart(2, 0)}</span>
            &nbsp;/&nbsp;
            <span title="Y">{String(cursor.y).padStart(2, 0)}</span>
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
};

MenuBar.propTypes = {
  classes: PropTypes.object.isRequired,
  cursor: PropTypes.object.isRequired,
  bounds: PropTypes.object.isRequired,
  tileSize: PropTypes.number.isRequired,
  ui: PropTypes.object.isRequired,
  setAppState: PropTypes.func.isRequired,
};

export default withStyles(styles, { withTheme: true })(MenuBar);
