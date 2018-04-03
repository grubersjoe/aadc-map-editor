import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, Typography, withStyles } from 'material-ui';
import { blueGrey, green, red } from 'material-ui/colors';
import FolderOpenIcon from 'material-ui-icons/FolderOpen';
import CheckCircleIcon from 'material-ui-icons/CheckCircle';
import NotInterestedIcon from 'material-ui-icons/NotInterested';
import Dropzone from 'react-dropzone';
import maxBy from 'lodash/maxBy';

import { getModalStyle } from '../util/style';
import { parseXmlTags, XmlTags } from '../services/XmlLoader';
import { hash } from '../util/hash';
import { DEBUG } from '../config';

const styles = theme => ({
  fabLoad: {
    position: 'fixed',
    bottom: theme.spacing.unit * 4 + theme.spacing.unit * 8.5 * 2,
    right: theme.spacing.unit * 3,
  },
  modalButton: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.common.white,
    '&:hover': {
      backgroundColor: theme.palette.secondary.dark,
    },
  },
  paper: {
    position: 'fixed',
    width: theme.spacing.unit * 54,
    padding: '1.25rem',
    backgroundColor: blueGrey[50],
    boxShadow: theme.shadows[6],
    color: blueGrey[900],
    outline: 'none !important',
  },
  headline: {
    backgroundColor: theme.palette.secondary.dark,
    margin: '-1.25rem -1.25rem 1.25rem -1.25rem',
    padding: `${theme.spacing.unit * 1.75}px ${theme.spacing.unit * 3}px`,
    color: theme.palette.common.white,
  },
  drop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    minHeight: 120,
    marginBottom: '.75rem',
    backgroundColor: blueGrey[100],
    transition: 'background-color .3s ease-in-out',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  dropActive: {
    backgroundColor: blueGrey[100],
  },
  dropAccept: {
    background: green[300],
  },
  dropReject: {
    background: red[300],
  },
  messages: {
    marginBottom: '1.25rem',
  },
});

class LoadFile extends React.Component {
  state = {
    open: false,
    accepted: null,
    rejected: null,
  };

  onFileAccepted = (files) => {
    this.loadXmlFile(files);
  };

  onFileRejected = (files) => {
    this.setState({ accepted: null, rejected: files });
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
        const tags = parseXmlTags(ev.target.result, elemTypes);
        const mapElems = this.addKeys(tags);

        const xMax = Math.ceil(maxBy(tags, 'x').x) - this.props.xMin + 1;
        const yMax = Math.ceil(maxBy(tags, 'y').y) - this.props.yMin + 1;

        this.props.setMapElems(mapElems);
        this.props.setBounds({ xMax, yMax });

        this.setState({
          accepted: files,
          rejected: null,
        });
      } catch (e) {
        if (DEBUG) {
          console.error(e.message);
        }
        this.setState({
          accepted: null,
          rejected: files,
        });
      }
    };

    reader.onerror = (e) => {
      if (DEBUG) {
        console.error(e.message);
      }
      this.setState({
        accepted: null,
        rejected: files,
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

  openModal = () => {
    this.setState({
      open: true,
      accepted: null,
      rejected: null,
    });
  };

  closeModal = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Button
          variant="fab"
          color="primary"
          className={classes.fabLoad}
          onClick={this.openModal}
          title="Load XML input file"
          style={{ zIndex: 1000 }}
        >
          <FolderOpenIcon />
        </Button>

        <Modal
          onClose={this.closeModal}
          open={this.state.open}
          BackdropProps={{
            classes: { root: classes.backdrop },
          }}
        >
          <div style={getModalStyle()} className={classes.paper}>
            <Typography variant="title" className={classes.headline}>
              Load input XML files
            </Typography>

            <Dropzone
              onDropAccepted={this.onFileAccepted}
              onDropRejected={this.onFileRejected}
              accept="text/xml"
              preventDropOnDocument
              disablePreview
              className={classes.drop}
              activeClassName={classes.dropActive}
              acceptClassName={classes.dropAccept}
              rejectClassName={classes.dropReject}
            >
              <Typography color="inherit" align="center" variant="subheading">
                Drop a <strong>tiles</strong> or <strong>road signs</strong> XML file here<br />
                or click for a file dialogue
              </Typography>
            </Dropzone>

            {
              this.state.accepted &&
              <Typography variant="subheading" className={classes.messages} style={{ color: green[600] }}>
                <CheckCircleIcon
                  style={{
                    position: 'relative',
                    top: 7,
                    marginRight: 8,
                  }}
                />
                <span>
                  <code>{this.state.accepted.map(f => f.name)}</code> loaded succesfully
                </span>
              </Typography>
            }


            {
              this.state.rejected &&
              <Typography variant="subheading" className={classes.messages} style={{ color: red[600] }}>
                <NotInterestedIcon
                  style={{
                    position: 'relative',
                    top: 7,
                    marginRight: 8,
                  }}
                />
                <span>
                  <code>{this.state.rejected.map(f => f.name)}</code> could not be loaded
                </span>
              </Typography>
            }

            <Button color="primary" size="large" fullWidth className={classes.modalButton} onClick={this.closeModal}>
              Done
            </Button>
          </div>
        </Modal>
      </div>
    );
  }
}

LoadFile.propTypes = {
  classes: PropTypes.object.isRequired,
  setBounds: PropTypes.func.isRequired,
  setMapElems: PropTypes.func.isRequired,
  xMin: PropTypes.number.isRequired,
  yMin: PropTypes.number.isRequired,
};

export default withStyles(styles)(LoadFile);
