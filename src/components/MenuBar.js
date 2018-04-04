import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { AppBar, FormControlLabel, Toolbar, Typography } from 'material-ui';
import ClearIcon from 'material-ui-icons/Clear';

import NumberInput from './NumberInput';
import Switch from './Switch';
import { XmlTags } from '../services/Xml';

const styles = theme => ({
  root: {
    width: '100%',
  },
  flex: {
    flex: 1,
  },
  marginRight: {
    marginRight: theme.spacing.unit * 4,
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
    marginLeft: theme.spacing.unit * 5,
  },
});

let prevAnimateState;

const MenuBar = (props) => {
  const {
    classes, bounds, tileSize, ui, applyFilter, setTileSize, setBounds,
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
                  applyFilter({ grid: checked });
                }}
              />
            }
            label="Grid"
            className={classes.marginRight}
          />

          <FormControlLabel
            control={
              <Switch
                checked={ui[XmlTags.TILE]}
                onChange={(event, checked) => applyFilter({ [XmlTags.TILE]: checked })}
              />
            }
            label="Tiles"
            className={classes.marginRight}
          />

          <FormControlLabel
            control={
              <Switch
                checked={ui[XmlTags.ROAD_SIGN]}
                onChange={(event, checked) => applyFilter({ [XmlTags.ROAD_SIGN]: checked })}

              />
            }
            label="Signs"
            className={classes.marginRight}
          />

          <FormControlLabel
            control={
              <Switch
                checked={ui[XmlTags.PEDESTRIAN_CROSSING]}
                onChange={(event, checked) =>
                  applyFilter({ [XmlTags.PEDESTRIAN_CROSSING]: checked })}
              />
            }
            label="Zebras"
            className={classes.marginRight}
          />

          <FormControlLabel
            control={
              <Switch
                checked={ui.animate}
                onChange={(event, checked) => applyFilter({ animate: checked })}
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
              marginLeft: '2.5rem',
              marginRight: '2rem',
            }}
            onChange={val => setTileSize(val)}
            onFocus={() => {
              prevAnimateState = ui.animate;
              applyFilter({ animate: false });
            }}
            onBlur={() => {
              applyFilter({ animate: prevAnimateState });
            }}
          />

          <NumberInput
            value={width}
            size={3.25}
            min={2}
            max={50}
            className={classes.input}
            onChange={val => setBounds({ xMax: parseInt(val, 10) + bounds.xMin }, true)}
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
            onChange={val => setBounds({ yMax: parseInt(val, 10) + bounds.yMin }, true)}
          />
        </Toolbar>
      </AppBar>
    </div>
  );
};

MenuBar.propTypes = {
  classes: PropTypes.object.isRequired,
  bounds: PropTypes.object.isRequired,
  tileSize: PropTypes.number.isRequired,
  ui: PropTypes.object.isRequired,
  applyFilter: PropTypes.func.isRequired,
  setTileSize: PropTypes.func.isRequired,
  setBounds: PropTypes.func.isRequired,
};

export default withStyles(styles, { withTheme: true })(MenuBar);
