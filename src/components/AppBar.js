import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { FormControlLabel, Toolbar, Typography } from '@material-ui/core';
import MuiAppBar from '@material-ui/core/AppBar';
import ClearIcon from '@material-ui/icons/Clear';

import NumberInput from './NumberInput';
import LoadExample from './LoadExample';
import Switch from './Switch';
import { XmlTags } from '../services/Xml';

const styles = theme => ({
  root: {
    width: '100%',
  },
  title: {
    flex: 1,
    whiteSpace: 'nowrap',
  },
  marginRight: {
    marginRight: theme.spacing.unit * 4,
  },
  input: {
    fontSize: 20,
    '&:before': {
      borderBottom: '1px solid rgba(255, 255, 255, 0.5)',
    },
    '&:hover:before': {
      borderBottom: '1px solid rgba(255, 255, 255, 0.75) !important',
    },
    '&:after': {
      borderBottom: '1px solid rgba(255, 255, 255, 1)',
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
  },
});

const AppBar = (props) => {
  const {
    classes, bounds, tileSize, animate, filter,
    setAnimate, applyFilter, setMapElems, setTileSize, setBounds,
  } = props;
  const width = bounds.xMax - bounds.xMin;
  const height = bounds.yMax - bounds.yMin;

  return (
    <div id="app-bar" className={classes.root}>
      <MuiAppBar position="fixed">
        <Toolbar>
          <Typography variant="title" color="inherit" className={classes.title}>
            AADC Map Editor
          </Typography>

          <LoadExample setMapElems={setMapElems} />

          <FormControlLabel
            control={
              <Switch
                checked={filter.grid}
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
                checked={filter[XmlTags.TILE]}
                onChange={(event, checked) => applyFilter({ [XmlTags.TILE]: checked })}
              />
            }
            label="Tiles"
            className={classes.marginRight}
          />

          <FormControlLabel
            control={
              <Switch
                checked={filter[XmlTags.ROAD_SIGN]}
                onChange={(event, checked) => applyFilter({ [XmlTags.ROAD_SIGN]: checked })}

              />
            }
            label="Signs"
            className={classes.marginRight}
          />

          <FormControlLabel
            control={
              <Switch
                checked={filter[XmlTags.PEDESTRIAN_CROSSING]}
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
                checked={animate}
                onChange={(event, checked) => setAnimate(checked)}
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
            onChange={val => setTileSize(val)}
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
      </MuiAppBar>
    </div>
  );
};

AppBar.propTypes = {
  classes: PropTypes.object.isRequired,
  bounds: PropTypes.object.isRequired,
  tileSize: PropTypes.number.isRequired,
  animate: PropTypes.bool.isRequired,
  filter: PropTypes.object.isRequired,
  setAnimate: PropTypes.func.isRequired,
  applyFilter: PropTypes.func.isRequired,
  setMapElems: PropTypes.func.isRequired,
  setTileSize: PropTypes.func.isRequired,
  setBounds: PropTypes.func.isRequired,
};

export default withStyles(styles, { withTheme: true })(AppBar);
