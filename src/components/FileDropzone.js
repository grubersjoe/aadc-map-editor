import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDropzone from 'react-dropzone';
import { Backdrop, IconButton, Snackbar, Typography, withStyles, } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { loadXmlFile } from '../services/Xml';

const styles = theme => ({
  dropzone: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  wrapper: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
  },
  backdrop: {
    backgroundColor: 'hsla(188, 100%, 29%, 0.75)',
  },
  typo: {
    color: '#fff',
    fontSize: '2rem',
    fontWeight: 500,
    lineHeight: 1.5,
  },
  snackClose: {
    width: theme.spacing.unit * 4,
    height: theme.spacing.unit * 4,
  },
});

class FileDropzone extends Component {
  state = {
    dropActive: false,
    accepted: null,
    rejected: null,
    errorMsg: null,
    snackOpen: false,
  };

  onDragEnter = () => {
    this.setState({
      dropActive: true,
      accepted: null,
      rejected: null,
      snackOpen: false,
    });
  };

  onDragLeave = () => {
    this.setState({
      dropActive: false,
      accepted: null,
      rejected: null,
    });
  };

  onFileAccepted = (files) => {
    loadXmlFile(files)
      .then((nodes) => {
        this.props.setMapElems(nodes);
        this.setState({
          dropActive: false,
          accepted: files,
          rejected: null,
          errorMsg: null,
          snackOpen: true,
        });
      })
      .catch((err) => {
        this.setState({
          dropActive: false,
          accepted: null,
          rejected: files,
          errorMsg: err.message,
          snackOpen: true,
        });
      });
  };

  onFileRejected = (files) => {
    this.setState({
      dropActive: false,
      accepted: null,
      rejected: files,
      snackOpen: true,
    });
  };

  handleSnackClose = () => {
    this.setState({
      snackOpen: false,
    });
  };

  render() {
    const {
      dropActive, accepted, rejected, errorMsg, snackOpen,
    } = this.state;
    const { classes } = this.props;

    let snackMessage = 'Unexpected error';
    if (accepted && accepted.length) {
      snackMessage = `${accepted[0].name} loaded`;
    } else if (rejected && rejected.length) {
      snackMessage = `Unable to load ${rejected[0].name}: ${errorMsg}`;
    }

    return (
      <ReactDropzone
        disableClick
        accept="text/xml"
        disablePreview
        className={classes.dropzone}
        onDropAccepted={this.onFileAccepted}
        onDropRejected={this.onFileRejected}
        onDragEnter={this.onDragEnter}
        onDragLeave={this.onDragLeave}
      >
        {
          dropActive &&
          <div className={classes.wrapper}>
            <Backdrop open={dropActive} classes={{ root: classes.backdrop }} />

            <Typography
              color="inherit"
              align="center"
              variant="display1"
              className={classes.typo}
            >
              Drop an XML file here containing<br />
              <code>&lt;tile/&gt;</code> or <code>&lt;roadSign/&gt;</code> data
            </Typography>
          </div>
        }

        <Snackbar
          open={snackOpen}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          autoHideDuration={6000}
          onClose={this.handleSnackClose}
          message={snackMessage}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={classes.snackClose}
              onClick={this.handleSnackClose}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />

        {this.props.children}
      </ReactDropzone>
    );
  }
}

FileDropzone.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired,
  setMapElems: PropTypes.func.isRequired,
};

export default withStyles(styles)(FileDropzone);
