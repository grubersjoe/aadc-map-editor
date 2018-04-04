import React, { Component } from 'react';
import { MuiThemeProvider } from 'material-ui';
import merge from 'lodash/merge';

import { THEME } from '../config';
import { loadSavedState, saveState } from '../services/LocalStorage';
import { XmlTags, mapElemsToXml } from '../services/Xml';
import Dropzone from '../components/FileDropzone';
import Map from '../components/Map';
import { MapElemOrigin } from '../components/MapElem';
import MenuBar from '../components/MenuBar';
import ResetMapDialog from '../components/ResetMapDialog';
import ExportDialog from '../components/ExportDialog';

class App extends Component {
  state = merge({
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
    filter: {
      animate: false,
      grid: true,
      [XmlTags.TILE]: true,
      [XmlTags.ROAD_SIGN]: true,
      [XmlTags.PEDESTRIAN_CROSSING]: true,
    },
  }, loadSavedState());

  componentDidMount() {
    window.addEventListener('keydown', this.onKeydown);
    window.addEventListener('unload', () => {
      saveState(this.state);
    });
  }

  onKeydown = (ev) => {
    if (document.activeElement instanceof HTMLInputElement) {
      return;
    }

    if ([
      'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Delete', 'd',
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
      case 'd':
      case 'Delete':
        this.deleteAtCursor();
        break;
      case 'r':
        this.rotateTile();
        break;
      case 'R':
        this.rotateTile(-1);
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

  /**
   * Sets the map boundaries (only increases map boundaries per default)
   * @param bounds A boundaries object (.xMax, .yMax, .xMin, .yMin)
   * @param force Overwrite boundaries without any checks
   */
  setBounds = (bounds, force = false) => {
    const {
      xMax, yMax, xMin, yMin,
    } = this.state.bounds;

    this.setState({
      bounds: {
        xMax: force ? (bounds.xMax || xMax) : Math.max(xMax, bounds.xMax || 0),
        yMax: force ? (bounds.yMax || yMax) : Math.max(yMax, bounds.yMax || 0),
        xMin: force ? (bounds.xMin || xMin) : Math.min(xMin, bounds.xMin || 0),
        yMin: force ? (bounds.yMin || yMin) : Math.min(yMin, bounds.yMin || 0),
      },
    });
  };

  /**
   * Set the tile size
   * @param tileSize The tile size in pixel
   */
  setTileSize = (tileSize) => {
    this.setState({ tileSize });
  };

  /**
   * Set map elements: adds only unique new elements
   * @param elems A list of map elements
   * @param force Overwrites current map element list
   */
  setMapElems = (elems, force = false) => {
    if (force) {
      this.setState({ mapElems: elems });
    } else {
      // Keep elements, which the user has added and non-duplicates (check hash)
      const keys = elems.map(elem => elem.key);

      const rest = this.state.mapElems
        .filter(elem => elem.origin === MapElemOrigin.EDITOR || !keys.includes(elem.key));

      this.setState({
        mapElems: [...rest, ...elems],
      });
    }
  };

  applyFilter = (elems) => {
    this.setState({
      filter: Object.assign({}, this.state.filter, elems),
    });
  };

  /**
   * Add a specific tile element with default attributes
   * @param type The tile type (1 - 8)
   */
  addTile = (type) => {
    const { x, y } = this.state.cursor;
    const tile = {
      x,
      y,
      dir: 0,
      type,
      elemType: XmlTags.TILE,
      init: 0,
      key: MapElemOrigin.EDITOR + Date.now(),
      origin: MapElemOrigin.EDITOR,
    };

    this.deleteAtCursor();
    this.setState({
      mapElems: [...this.state.mapElems, tile],
    });
  };

  /**
   * Delete the tile at current cursor position
   */
  deleteAtCursor = () => {
    const { x, y } = this.state.cursor;
    const mapElems = this.state.mapElems.filter(elem => !(elem.x === x && elem.y === y));
    this.setState({ mapElems });
  };

  /**
   * Rotate the tile at current cursor position
   * @param rotDir Rotation direction
   */
  rotateTile = (rotDir = 1) => {
    const { x, y } = this.state.cursor;
    const mapElems = this.state.mapElems.map((tile) => {
      if (tile.elemType === XmlTags.TILE && tile.x === x && tile.y === y) {
        // eslint-disable-next-line no-param-reassign
        tile.dir = (tile.dir + 90 * rotDir) % 360;
      }
      return tile;
    });

    this.setState({ mapElems });
  };

  /**
   * Move the cursor by a specific offset in x and y direction
   * @param xOffset X offset
   * @param yOffset Y offset
   */
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
    const {
      mapElems, cursor, bounds, filter, tileSize,
    } = this.state;

    const activeMapElems = mapElems.filter((elem) => {
      let draw = false;
      Object.keys(filter)
        .forEach((type) => {
          draw = draw || (filter[type] && elem.elemType === type);
        });

      return draw;
    });

    return (
      <MuiThemeProvider theme={THEME}>
        <MenuBar
          bounds={bounds}
          tileSize={tileSize}
          filter={filter}
          applyFilter={this.applyFilter}
          setTileSize={this.setTileSize}
          setBounds={this.setBounds}
        />

        <Dropzone
          setBounds={this.setBounds}
          setMapElems={this.setMapElems}
          xMin={bounds.xMin}
          yMin={bounds.yMin}
        >
          <Map
            mapElems={activeMapElems}
            cursor={cursor}
            bounds={bounds}
            tileSize={tileSize}
            filter={filter}
          />
        </Dropzone>

        <ExportDialog xmlCode={mapElemsToXml(activeMapElems)} />

        <ResetMapDialog setMapElems={this.setMapElems} />
      </MuiThemeProvider>
    );
  };
}

export default App;
