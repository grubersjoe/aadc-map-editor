import React from 'react';
import PropTypes from 'prop-types';
import { Button, withStyles } from 'material-ui';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
} from 'material-ui/Dialog';
import Slide from 'material-ui/transitions/Slide';
import FileDownloadIcon from 'material-ui-icons/FileDownload';
import formatXml from 'prettify-xml';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const styles = theme => ({
  fabDownload: {
    position: 'fixed',
    bottom: theme.spacing.unit * 4 + theme.spacing.unit * 8.5,
    right: theme.spacing.unit * 3,
    zIndex: 1000,
  },
  secondaryButton: {
    background: theme.palette.secondary.main,
    color: theme.palette.common.white,
    '&:hover': {
      background: theme.palette.secondary.dark,
    },
  },
});

class ExportDialog extends React.Component {
  state = {
    open: false,
  };

  openDialog = () => {
    this.setState({ open: true });
  };

  closeDialog = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes, xmlCode } = this.props;

    return (
      <div>
        <Button
          variant="fab"
          color="primary"
          className={classes.fabDownload}
          title="Export map to XML file"
          onClick={this.openDialog}
          style={{ zIndex: 1000 }}
        >
          <FileDownloadIcon />
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
              padding: '.5rem',
            },
          }}
        >
          <DialogTitle>
            XML Export
          </DialogTitle>
          <DialogContent>
            <pre>
              {formatXml(xmlCode)}
            </pre>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeDialog} className={classes.secondaryButton}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

ExportDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  xmlCode: PropTypes.string.isRequired,
};

export default withStyles(styles)(ExportDialog);
