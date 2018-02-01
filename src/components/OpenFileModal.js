import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, Typography, Modal, Button } from 'material-ui';
import { blueGrey, red, green } from 'material-ui/colors';
import FolderOpenIcon from 'material-ui-icons/FolderOpen';
import CheckCircleIcon from 'material-ui-icons/CheckCircle';
import NotInterestedIcon from 'material-ui-icons/NotInterested';
import Dropzone from 'react-dropzone';

import { getModalStyle } from '../util/style';

const styles = theme => ({
  button: {
    position: 'fixed',
    bottom: theme.spacing.unit * 11.5,
    right: theme.spacing.unit * 3,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  paper: {
    position: 'fixed',
    width: theme.spacing.unit * 60,
    backgroundColor: blueGrey[50],
    boxShadow: theme.shadows[6],
    color: blueGrey[900],
    outline: 'none !important',
  },
  headline: {
    background: theme.palette.secondary.dark,
    padding: `${theme.spacing.unit * 1.5}px ${theme.spacing.unit * 3}px`,
  },
  withPadding: {
    padding: theme.spacing.unit * 3,
    paddingTop: 0,
  },
  drop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    minHeight: 120,
    margin: '1.5rem',
    backgroundColor: blueGrey[100],
    transition: 'background-color .3s ease-in-out',
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
});

class OpenFileModal extends React.Component {
  state = {
    open: false,
    accepted: null,
    rejected: null,
  };

  onFileDropAccepted = (files) => {
    this.setState({
      accepted: files,
      rejected: null,
    });
  };

  onFileDropRejected = (files) => {
    this.setState({
      accepted: null,
      rejected: files,
    });
  };

  openModal = () => {
    this.setState({ open: true });
  };

  closeModal = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Button fab color="secondary" className={classes.button} onClick={this.openModal}>
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
              Load XML file
            </Typography>
            <Dropzone
              onDropAccepted={this.onFileDropAccepted}
              onDropRejected={this.onFileDropRejected}
              accept="text/xml"
              preventDropOnDocument
              disablePreview
              className={classes.drop}
              activeClassName={classes.dropActive}
              acceptClassName={classes.dropAccept}
              rejectClassName={classes.dropReject}
            >
              <Typography type="subheading" style={{ color: 'inherit' }}>
                Drop an XML file here or click for a file dialogue
              </Typography>
            </Dropzone>

            {
              this.state.accepted &&
              <Typography type="body1" className={classes.withPadding} style={{ color: green[600] }}>
                <CheckCircleIcon
                  style={{
                    position: 'relative',
                    top: 7,
                    marginRight: 8,
                  }}
                />
                <span><code>{this.state.accepted.map(f => f.name)}</code> succesfully loaded!</span>
              </Typography>
            }


            {
              this.state.rejected &&
              <Typography type="body1" className={classes.withPadding} style={{ color: red[600] }}>
                <NotInterestedIcon
                  style={{
                    position: 'relative',
                    top: 7,
                    marginRight: 8,
                  }}
                />
                <span><code>{this.state.rejected.map(f => f.type)}</code> is not allowed!</span>
              </Typography>
            }


          </div>
        </Modal>
      </div>
    );
  }
}

OpenFileModal.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OpenFileModal);
