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
import { XmlTags } from '../services/XmlLoader';
import { MapElemOrigin } from '../components/MapElem';

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

  componentDidMount() {
    window.addEventListener('keydown', this.onKeydown);
  }

  onKeydown = (ev) => {
    if (document.activeElement instanceof HTMLInputElement) {
      return;
    }

    if ([
      'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
      '1', '2', '3', '4', '5', '7', '8',
    ].includes(ev.key)) {
      ev.preventDefault();
    }

    switch (ev.key) {
      case 'ArrowUp':
        this.moveCursor(0, 1);
        break;
      case 'ArrowDown':
        this.moveCursor(0, -1);
        break;
      case 'ArrowLeft':
        this.moveCursor(-1, 0);
        break;
      case 'ArrowRight':
        this.moveCursor(1, 0);
        break;
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '7':
      case '8':
        this.addTile(parseInt(ev.key, 10));
        break;
      default:
      // nop
    }
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
    // Keep elements, which the user has added and non-duplicates (check hash)
    const keys = elems.map(elem => elem.key);
    const rest = filter(this.state.mapElems, elem =>
      elem.origin === MapElemOrigin.EDITOR || !includes(keys, elem.key));

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

  /**
   * Add a specific tile element with default attributes
   * @param type The tile type (1 - 8)
   */
  addTile = (type) => {
    const { x, y } = this.state.cursor;
    const mapElem = {
      x,
      y,
      dir: 0,
      type,
      elemType: XmlTags.TILE,
      init: 0,
      key: MapElemOrigin.EDITOR + Date.now(),
      origin: MapElemOrigin.EDITOR,
    };

    this.setState({
      mapElems: [...this.state.mapElems, mapElem],
    });
  };

  moveCursor = (xOffset = 0, yOffset = 0) => {
    const { bounds } = this.state;

    const x = this.state.cursor.x + xOffset;
    const y = this.state.cursor.y + yOffset;

    if (x < bounds.xMin || y < bounds.yMin) {
      return;
    }

    const xMax = x === bounds.xMax ? x + 1 : bounds.xMax;
    const yMax = y === bounds.yMax ? y + 1 : bounds.yMax;

    this.setState(prevState => ({
      cursor: { ...prevState.cursor, x, y },
      bounds: { ...prevState.bounds, xMax, yMax },
    }));
  };

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
          style={{ zIndex: 1000 }}
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
