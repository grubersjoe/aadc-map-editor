import React from 'react';
import PropTypes from 'prop-types';
import { cyan } from '@material-ui/core/colors';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  withStyles,
} from '@material-ui/core';
import HelpIcon from '@material-ui/icons/Help';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const styles = theme => ({
  fabHelp: {
    position: 'fixed',
    bottom: theme.spacing.unit * 3,
    right: theme.spacing.unit * 3,
    color: '#fff',
    backgroundColor: cyan[800],
    '&:hover': {
      backgroundColor: cyan[900],
    },
    zIndex: 1000,
  },
  primaryButton: {
    color: '#fff',
    background: theme.palette.secondary.main,
    backgroundColor: cyan[800],
    '&:hover': {
      backgroundColor: cyan[900],
    },
  },
});

class Help extends React.Component {
  // noinspection JSUnusedGlobalSymbols
  state = {
    open: false,
  };

  openDialog = () => {
    this.setState({
      open: true,
    });
  };

  closeDialog = () => {
    this.setState({
      open: false,
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Button
          variant="fab"
          className={classes.fabHelp}
          title="Export map to XML file"
          onClick={this.openDialog}
          style={{ zIndex: 1000 }}
        >
          <HelpIcon />
        </Button>

        <Dialog
          open={this.state.open}
          transition={Transition}
          keepMounted
          onClose={this.closeDialog}
          PaperProps={{
            style: {
              width: '50rem',
              maxWidth: '50rem',
              padding: '.25rem',
            },
          }}
        >
          <DialogTitle>
            How to use the editor
          </DialogTitle>
          <DialogContent>
            <ul>
              <li>Move the cursor around with the <kbd>Arrow</kbd> keys</li>
              {
                // <li><kbd>Enter</kbd> insert mode with enter key (cursor turns yellow)</li>
                // <li><kbd>Esc</kbd> exists insert mode</li>
                // <li>In insert mode: <kbd>Space</kbd> rotates through all tile types<br /><kbd>Shift</kbd> rotates the other way around</li>
                // <li>In insert mode: <kbd>Arrow up</kbd> rotates current tile</li>
                // <li>In insert mode, if no tile is set: <kbd>Arrow up</kbd> inserts default tile (straight), repeat to rotate this tile</li>
              }
              <li>The number keys <kbd>1</kbd> - <kbd>5</kbd> and <kbd>7 - 8</kbd> insert a tile of
                the corresponding type immediately:
                <ul>
                  <li>1 = Straight</li>
                  <li>2 = T-Crossing</li>
                  <li>3 = Plus-Crossing</li>
                  <li>4 = Large Turn</li>
                  <li>5 = Small Turn</li>
                  <li>7 = S-Turn (left)</li>
                  <li>8 = S-Turn (right)</li>
                </ul>
              </li>
              <li><kbd>Del</kbd> or <kbd>d</kbd> delete the tile under the cursor</li>
              <li><kbd>r</kbd> rotates the current tile clockwise, <kbd>R</kbd> counter-clockwise
              </li>
            </ul>
          </DialogContent>
          <DialogActions>
            <Button
              className={classes.primaryButton}
              onClick={this.closeDialog}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

Help.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Help);
