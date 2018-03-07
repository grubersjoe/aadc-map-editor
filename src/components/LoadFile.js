import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, Typography, Modal, Button } from 'material-ui';
import { blueGrey, red, green } from 'material-ui/colors';
import FolderOpenIcon from 'material-ui-icons/FolderOpen';
import CheckCircleIcon from 'material-ui-icons/CheckCircle';
import NotInterestedIcon from 'material-ui-icons/NotInterested';
import Dropzone from 'react-dropzone';
import maxBy from 'lodash/maxBy';

import { getModalStyle } from '../util/style';
import { XmlTags, parseXmlTags } from '../services/XmlLoader';
import { hash } from '../util/hash';

const styles = theme => ({
  button: {
    position: 'fixed',
    bottom: theme.spacing.unit * 13,
    right: theme.spacing.unit * 3,
  },
  modalButton: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.common.white,
    '&:hover': {
      backgroundColor: theme.palette.secondary.dark,
    },
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  paper: {
    position: 'fixed',
    width: theme.spacing.unit * 54,
    padding: '1.5rem',
    backgroundColor: blueGrey[50],
    boxShadow: theme.shadows[6],
    color: blueGrey[900],
    outline: 'none !important',
  },
  headline: {
    backgroundColor: theme.palette.secondary.dark,
    margin: '-1.5rem -1.5rem 1.5rem -1.5rem',
    padding: `${theme.spacing.unit * 1.5}px ${theme.spacing.unit * 3}px`,
  },
  drop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    minHeight: 80,
    marginBottom: '1.5rem',
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
    marginBottom: '1.5rem',
  },
});

class LoadFile extends React.Component {
  state = {
    open: false,
    accepted: null,
    rejected: null,
  };

  onTilesFileAccepted = (files) => {
    this.loadFile(files, XmlTags.TILE);
  };


  onRoadSignsFileAccepted = (files) => {
    this.loadFile(files, XmlTags.ROAD_SIGN);
  };

  onFileRejected = (files) => {
    this.setState({ accepted: null, rejected: files });
  };

  loadFile = (files, tagType) => {
    const reader = new FileReader();
    reader.readAsText(files[0]);

    reader.onload = (ev) => {
      try {
        const tags = parseXmlTags(ev.target.result, [tagType]);
        let xMax = Math.ceil(maxBy(tags, 'x').x) - this.props.xMin;
        let yMax = Math.ceil(maxBy(tags, 'y').y) - this.props.yMin;

        if (tagType === XmlTags.TILE) {
          xMax += 1;
          yMax += 1;
        }

        const mapElems = this.addKeys(tags);

        this.props.setMapElems(mapElems);
        this.props.setBounds({ xMax, yMax });
        this.setState({ accepted: files, rejected: null });
      } catch (e) {
        console.error(e.message);
        this.setState({ accepted: null, rejected: files });
      }
    };

    reader.onerror = (e) => {
      console.error(e.message);
      this.setState({ accepted: null, rejected: files });
    };
  };

  addKeys = (elems) => {
    return elems.map((elem) => {
      const {
        elemType, type, x, y, dir, init,
      } = elem;

      // eslint-disable-next-line no-param-reassign
      elem.key = hash(elemType + type + x + y + dir + init);

      return elem;
    });
  };

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
          fab
          color="secondary"
          className={classes.button}
          onClick={this.openModal}
          title="Load XML input file"
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
            <Typography type="headline" className={classes.headline}>
              Load input XML files
            </Typography>

            <Dropzone
              onDropAccepted={this.onTilesFileAccepted}
              onDropRejected={this.onFileRejected}
              accept="text/xml"
              preventDropOnDocument
              disablePreview
              className={classes.drop}
              activeClassName={classes.dropActive}
              acceptClassName={classes.dropAccept}
              rejectClassName={classes.dropReject}
            >
              <Typography type="subheading" style={{ color: 'inherit' }}>
                Drop a <strong>tiles</strong> XML file here
              </Typography>
            </Dropzone>

            <Dropzone
              onDropAccepted={this.onRoadSignsFileAccepted}
              onDropRejected={this.onFileRejected}
              accept="text/xml"
              preventDropOnDocument
              disablePreview
              className={classes.drop}
              activeClassName={classes.dropActive}
              acceptClassName={classes.dropAccept}
              rejectClassName={classes.dropReject}
            >
              <Typography type="subheading" style={{ color: 'inherit' }}>
                Drop a <strong>road signs</strong> XML file here
              </Typography>
            </Dropzone>

            {
              this.state.accepted &&
              <Typography type="subheading" className={classes.messages} style={{ color: green[600] }}>
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
              <Typography type="subheading" className={classes.messages} style={{ color: red[600] }}>
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

            <Button size="large" fullWidth className={classes.modalButton} onClick={this.closeModal}>
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
