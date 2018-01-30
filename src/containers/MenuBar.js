import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { AppBar, Toolbar, Typography, FormGroup } from 'material-ui';
import ClearIcon from 'material-ui-icons/Clear';

import NumberInput from '../components/NumberInput';

const styles = {
  root: {
    width: '100%',
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  input: {
    color: '#fff',
    fontSize: 26,
    '&:hover:before': {
      backgroundColor: 'rgba(255, 255, 255, 0.9) !important',
    },
    '&:before': {
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    '&:after': {
      backgroundColor: '#ddd',
    },
  },
};

const MenuBar = (props) => {
  const { classes, bounds, setAppState } = props;
  const width = bounds.xMax - bounds.xMin;
  const height = bounds.yMax - bounds.yMin;

  return (
    <div className={classes.root}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography type="title" color="inherit" className={classes.flex}>
            AADC Map Editor
          </Typography>

          <FormGroup row>
            <NumberInput
              value={width}
              size={3.25}
              min={2}
              max={50}
              className={classes.input}
              onChange={(val) => {
                setAppState({
                  bounds: { xMax: val + bounds.xMin },
                });
              }}
            />

            <span
              style={{
                margin: '0 .5rem',
                fontSize: 30,
                color: 'rgba(255, 255, 255, 0.5)',
                lineHeight: '64px',
              }}
            >
              <ClearIcon />
            </span>

            <NumberInput
              value={height}
              size={3.25}
              min={2}
              max={50}
              className={classes.input}
              onChange={(val) => {
                setAppState({
                  bounds: { yMax: val + bounds.yMin },
                });
              }}
            />

            {/*<FormControlLabel*/}
            {/*control={*/}
            {/*<Switch*/}
            {/*checked={this.state.checkedA}*/}
            {/*onChange={(event, checked) => this.setState({ checkedA: checked })}*/}
            {/*/>*/}
            {/*}*/}
            {/*label="A"*/}
            {/*/>*/}
            {/*<FormControlLabel*/}
            {/*control={*/}
            {/*<Switch*/}
            {/*checked={this.state.checkedB}*/}
            {/*onChange={(event, checked) => this.setState({ checkedB: checked })}*/}
            {/*/>*/}
            {/*}*/}
            {/*label="B"*/}
            {/*/>*/}
          </FormGroup>
        </Toolbar>
      </AppBar>
    </div>
  );
};

MenuBar.propTypes = {
  classes: PropTypes.object.isRequired,
  bounds: PropTypes.object.isRequired,
  setAppState: PropTypes.func.isRequired,
};

export default withStyles(styles)(MenuBar);
