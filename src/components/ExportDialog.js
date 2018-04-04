import React from 'react';
import PropTypes from 'prop-types';
import { Button, IconButton, Snackbar, withStyles } from 'material-ui';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
} from 'material-ui/Dialog';
import CloseIcon from 'material-ui-icons/Close';
import Slide from 'material-ui/transitions/Slide';
import FileDownloadIcon from 'material-ui-icons/FileDownload';
import formatXml from 'prettify-xml';
import { CopyToClipboard } from 'react-copy-to-clipboard';

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
  primaryButton: {
    background: theme.palette.secondary.main,
    color: theme.palette.common.white,
    '&:hover': {
      background: theme.palette.secondary.dark,
    },
  },
  title: {
    padding: '1rem 1rem .5rem',
  },
  actions: {
    marginTop: '.75rem',
  },
  snackClose: {
    width: theme.spacing.unit * 4,
    height: theme.spacing.unit * 4,
  },
});

class ExportDialog extends React.Component {
  state = {
    open: false,
    copied: false,
  };

  openDialog = () => {
    this.setState({
      open: true,
      copied: false,
    });
  };

  closeDialog = () => {
    this.setState({ open: false });
  };

  closeSnack = () => {
    this.setState({
      copied: false,
    });
  };

  render() {
    const { classes, xmlCode } = this.props;
    const { copied } = this.state;

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
              padding: '.25rem',
            },
          }}
        >
          <DialogTitle className={classes.title}>
            XML Export
          </DialogTitle>
          <DialogContent>
            <pre>
              {formatXml(xmlCode)}
            </pre>
          </DialogContent>
          <DialogActions className={classes.actions}>
            <Button onClick={this.closeDialog}>
              Cancel
            </Button>

            <CopyToClipboard
              text={formatXml(xmlCode)}
              className={classes.primaryButton}
              onCopy={() => {
                this.setState({ copied: true });
                this.closeDialog();
              }}
            >
              <Button>Copy to clipboard</Button>
            </CopyToClipboard>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={copied}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          autoHideDuration={6000}
          onClose={this.closeSnack}
          message="XML copied to clipboard"
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={classes.snackClose}
              onClick={this.closeSnack}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />

      </div>
    );
  }
}

ExportDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  xmlCode: PropTypes.string.isRequired,
};

export default withStyles(styles)(ExportDialog);
