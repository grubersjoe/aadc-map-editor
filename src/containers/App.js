import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, MuiThemeProvider, Button } from 'material-ui';
import FileDownloadIcon from 'material-ui-icons/FileDownload';

import appTheme from '../theme';
import MenuBar from '../components/MenuBar';
import Map from '../components/Map';
import OpenFileModal from '../components/OpenFileModal';

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
    ui: {
      animate: true,
      grid: true,
    },
  };

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

  render = () => {
    const { classes } = this.props;
    const { x, y } = this.state.cursor;
    const { bounds, ui, tileSize } = this.state;

    return (
      <MuiThemeProvider theme={appTheme}>
        <MenuBar
          bounds={bounds}
          tileSize={tileSize}
          ui={ui}
          setAppState={this.setAppState}
        />
        <Map
          cursorX={x}
          cursorY={y}
          bounds={bounds}
          tileSize={tileSize}
          setAppState={this.setAppState}
          ui={ui}
        />

        <OpenFileModal />

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

