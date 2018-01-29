import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { AppBar, Toolbar, Typography, IconButton, FormGroup, FormControlLabel, Switch } from 'material-ui';
import MenuIcon from 'material-ui-icons/Menu';


const styles = {
  root: {
    width: '100%',
    position: 'relative',
    zIndex: 1000,
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

class ButtonAppBar extends Component {
  state = {
    checkedA: true,
    checkedB: false,
  };

  render = () => {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
              <MenuIcon />
            </IconButton>
            <Typography type="title" color="inherit" className={classes.flex}>
              AADC Map Editor
            </Typography>
            <FormGroup row={true}>
              <FormControlLabel
                control={
                  <Switch
                    checked={this.state.checkedA}
                    onChange={(event, checked) => this.setState({ checkedA: checked })}
                  />
                }
                label="A"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={this.state.checkedB}
                    onChange={(event, checked) => this.setState({ checkedB: checked })}
                  />
                }
                label="B"
              />
            </FormGroup>
          </Toolbar>
        </AppBar>
      </div>
    );
  };
}

ButtonAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ButtonAppBar);
