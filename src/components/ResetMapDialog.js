import React from 'react';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import Slide from 'material-ui/transitions/Slide';
import { withStyles } from 'material-ui';
import { red } from 'material-ui/colors';
import DeleteIcon from 'material-ui-icons/Delete';
import PropTypes from 'prop-types';
import { removeSavedState } from '../services/LocalStorage';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const styles = theme => ({
  fabReset: {
    position: 'fixed',
    bottom: theme.spacing.unit * 4,
    right: theme.spacing.unit * 3,
    zIndex: 1000,
    background: red[800],
    '&:hover': {
      background: red[900],
    },
  },
  errorButton: {
    background: theme.palette.error.main,
    color: theme.palette.common.white,
    '&:hover': {
      background: theme.palette.error.dark,
    },
  },
});

class ResetMapDialog extends React.Component {
  state = {
    open: false,
  };

  openDialog = () => {
    this.setState({ open: true });
  };

  closeDialog = () => {
    this.setState({ open: false });
  };

  resetMap = () => {
    removeSavedState();
    this.props.setMapElems([], true);
    this.closeDialog();
  };

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Button
          variant="fab"
          color="primary"
          className={classes.fabReset}
          title="Reset map"
          onClick={this.openDialog}
        >
          <DeleteIcon />
        </Button>

        <Dialog
          open={this.state.open}
          transition={Transition}
          keepMounted
          onClose={this.closeDialog}
          PaperProps={{
            style: {
              padding: '.25rem',
            },
          }}
        >
          <DialogTitle>
            Reset the map
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              This will delete all currently set map elements. Do you want to proceed?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={this.resetMap} className={classes.errorButton}>
              Reset map
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

ResetMapDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  setMapElems: PropTypes.func.isRequired,
};

export default withStyles(styles)(ResetMapDialog);
