import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, Typography, Modal, Button } from 'material-ui';
import { blueGrey } from 'material-ui/colors';
import FolderOpenIcon from 'material-ui-icons/FolderOpen';
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
    boxShadow: theme.shadows[5],
    color: blueGrey[900],
    outline: 'none !important',
  },
  headline: {
    background: theme.palette.secondary.dark,
    marginBottom: theme.spacing.unit * 2.5,
    padding: `${theme.spacing.unit * 1.5}px ${theme.spacing.unit * 3}px`,
  },
});

const dropStyles = {
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    minHeight: 120,
    margin: '1.5rem',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: blueGrey[500],
    backgroundColor: 'transparent',
    transition: 'all .3s ease-in-out',
  },
  active: {
    borderColor: blueGrey[700],
    background: blueGrey[100],
  },
};

class OpenFileModal extends React.Component {
  state = {
    open: true,
  };

  onFileDrop = (files) => {
    console.log(files);
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
          open={this.state.open}
          onClose={this.closeModal}
          BackdropProps={{
            classes: { root: classes.backdrop },
          }}
        >
          <div style={getModalStyle()} className={classes.paper}>
            <Typography type="headline" className={classes.headline}>
              Load XML file
            </Typography>
            <Dropzone
              onDrop={this.onFileDrop}
              style={dropStyles.base}
              activeStyle={dropStyles.active}
            >
              <Typography type="subheading" style={{ color: 'inherit' }}>
                Drop an XML file here or click for a dialogue
              </Typography>
            </Dropzone>
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
