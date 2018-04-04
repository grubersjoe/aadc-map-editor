import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDropzone from 'react-dropzone';
import maxBy from 'lodash/maxBy';
import {
  Backdrop,
  IconButton,
  Snackbar,
  Typography,
  withStyles,
} from 'material-ui';
import CloseIcon from 'material-ui-icons/Close';

import { DEBUG } from '../config';
import { hash } from '../util/hash';
import { parseXmlTags, XmlTags } from '../services/Xml';

const styles = theme => ({
  modal: {
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
    this.loadXmlFile(files);
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

  loadXmlFile = (files) => {
    const reader = new FileReader();
    reader.readAsText(files[0]);

    reader.onload = (ev) => {
      try {
        const elemTypes = [
          XmlTags.TILE,
          XmlTags.ROAD_SIGN,
          XmlTags.PEDESTRIAN_CROSSING,
          // XmlTags.PARKING_SPACE,
        ];
        const mapElems = parseXmlTags(ev.target.result, elemTypes);

        const xMax = Math.ceil(maxBy(mapElems, 'x').x) - this.props.xMin + 1;
        const yMax = Math.ceil(maxBy(mapElems, 'y').y) - this.props.yMin + 1;

        this.props.setMapElems(mapElems);
        this.props.setBounds({
          xMax,
          yMax,
        });

        this.setState({
          dropActive: false,
          accepted: files,
          rejected: null,
          snackOpen: true,
        });
      } catch (e) {
        if (DEBUG) {
          console.error(e.message);
        }
        this.setState({
          dropActive: false,
          accepted: null,
          rejected: files,
          snackOpen: true,
        });
      }
    };

    reader.onerror = (e) => {
      if (DEBUG) {
        console.error(e.message);
      }
      this.setState({
        dropActive: false,
        accepted: null,
        rejected: files,
        snackOpen: true,
      });
    };
  };

  addKeys = elems => elems.map((elem) => {
    const {
      elemType, type, x, y, dir, init,
    } = elem;

    // eslint-disable-next-line no-param-reassign
    elem.key = hash(elemType + type + x + y + dir + init);

    return elem;
  });

  render = () => {
    const {
      dropActive, accepted, rejected, snackOpen,
    } = this.state;
    const { classes } = this.props;

    let snackMessage = 'Unexpected error';
    if (accepted && accepted.length) {
      snackMessage = `${accepted[0].name} loaded`;
    } else if (rejected && rejected.length) {
      snackMessage = `${rejected[0].name} could not be loaded`;
    }

    return (
      <ReactDropzone
        disableClick
        accept="text/xml"
        disablePreview
        onDropAccepted={this.onFileAccepted}
        onDropRejected={this.onFileRejected}
        onDragEnter={this.onDragEnter}
        onDragLeave={this.onDragLeave}
        style={{}}
      >
        {
          dropActive &&
          <div className={classes.modal}>
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
  };
}

FileDropzone.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired,
  setBounds: PropTypes.func.isRequired,
  setMapElems: PropTypes.func.isRequired,
  xMin: PropTypes.number.isRequired,
  yMin: PropTypes.number.isRequired,
};

export default withStyles(styles)(FileDropzone);
