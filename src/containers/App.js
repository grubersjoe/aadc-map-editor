import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, MuiThemeProvider, Button } from 'material-ui';
import FileDownloadIcon from 'material-ui-icons/FileDownload';
import includes from 'lodash/includes';
import filter from 'lodash/filter';

import appTheme from '../theme';
import MenuBar from '../components/MenuBar';
import Map from '../components/Map';
import FileModal from '../components/LoadFile';

const styles = theme => ({
  fabDownload: {
    position: 'fixed',
    bottom: theme.spacing.unit * 4,
    right: theme.spacing.unit * 3,
  },
});

// eslint-disable-next-line react/prefer-stateless-function
class App extends Component {
  state = {
    cursor: {
      x: 0,
      y: 0,
    },
    bounds: {
      xMin: -1,
      yMin: -1,
      xMax: 15,
      yMax: 9,
    },
    tileSize: 80,
    mapElems: [],
    ui: {
      animate: false,
      grid: true,
    },
  };

  // FIXME: this is limited to two levels
  setAppState = (data, callback) => {
    const changes = {};
    Object.keys(data).forEach((key) => {
      if (typeof data[key] === 'object') {
        Object.assign(changes, {
          [key]: Object.assign(this.state[key], data[key]),
        });
      } else {
        Object.assign(changes, {
          [key]: data[key],
        });
      }
    });

    this.setState(changes, callback);
  };

  /**
   * Sets the map boundaries (only increases map boundaries per default)
   * @param bounds A boundaries object (.xMax, .yMax, .xMin, .yMin)
   * @param force Overwrite boundaries without any checks
   */
  setBounds = (bounds, force = false) => {
    this.setState({
      bounds: {
        xMax: force ? bounds.xMax : Math.max(this.state.bounds.xMax, bounds.xMax || 0),
        yMax: force ? bounds.yMax : Math.max(this.state.bounds.yMax, bounds.yMax || 0),
        xMin: force ? bounds.xMin : Math.min(this.state.bounds.xMin, bounds.xMin || 0),
        yMin: force ? bounds.yMin : Math.min(this.state.bounds.yMin, bounds.yMin || 0),
      },
    });
  };

  /**
   * Set map elements: adds only unique new elements
   * @param elems A list of map elements
   */
  setMapElems = (elems) => {
    const hashes = elems.map(elem => elem.hash);
    const rest = filter(this.state.mapElems, elem => !includes(hashes, elem.hash));

    this.setState({
      mapElems: [...rest, ...elems],
    });
  };

  /**
   * Get all map elems at specific position
   * @param x X coordinate
   * @param y Y coordinate
   * @returns {Array} List of map elem objects
   */
  getMapElem = (x, y) => filter(this.state.mapElems, { x, y });

  render = () => {
    const { classes } = this.props;
    const { x, y } = this.state.cursor;
    const {
      mapElems, bounds, ui, tileSize,
    } = this.state;

    return (
      <MuiThemeProvider theme={appTheme}>
        <MenuBar
          bounds={bounds}
          tileSize={tileSize}
          ui={ui}
          setAppState={this.setAppState}
        />

        <Map
          mapElems={mapElems}
          cursorX={x}
          cursorY={y}
          bounds={bounds}
          tileSize={tileSize}
          setAppState={this.setAppState}
          ui={ui}
        />

        <FileModal
          setBounds={this.setBounds}
          setMapElems={this.setMapElems}
          xMin={bounds.xMin}
          yMin={bounds.yMin}
        />

        <Button
          fab
          color="secondary"
          className={classes.fabDownload}
          title="Export map to XML file"
        >
          <FileDownloadIcon />
        </Button>
      </MuiThemeProvider>
    );
  };
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
