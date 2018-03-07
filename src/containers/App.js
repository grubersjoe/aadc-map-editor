import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, MuiThemeProvider, Button } from 'material-ui';
import FileDownloadIcon from 'material-ui-icons/FileDownload';
import find from 'lodash/find';

import appTheme from '../theme';
import MenuBar from '../components/MenuBar';
import Map from '../components/Map';
import FileModal from '../components/LoadFile';

const styles = theme => ({
  fabDownload: {
    position: 'fixed',
    bottom: theme.spacing.unit * 3,
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
    tileSize: 50,
    mapElems: [],
    ui: {
      animate: true,
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

  getMapElem = (x, y) => {
    return find(this.state.mapElems, { x, y });
  };

  render = () => {
    const { classes } = this.props;
    const { x, y } = this.state.cursor;
    const { mapElems, bounds, ui, tileSize } = this.state;

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
          setAppState={this.setAppState}
          xMin={bounds.xMin}
          yMin={bounds.yMin}
        />

        <Button fab color="secondary" className={classes.fabDownload}>
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
