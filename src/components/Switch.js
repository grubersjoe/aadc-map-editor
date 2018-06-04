import React from 'react';
import { withStyles } from '@material-ui/core';
import MuiSwitch from '@material-ui/core/Switch';
import PropTypes from 'prop-types';

export const styles = theme => ({
  bar: {
    backgroundColor: theme.palette.secondary.main,
  },
  checked: {
    color: theme.palette.secondary.main,
    '& + $bar': {
      backgroundColor: theme.palette.secondary.main,
    },
  },
});

const Switch = (props) => {
  const { classes, ...rest } = props;

  return (
    <MuiSwitch
      classes={classes}
      {...rest}
    />
  );
};


Switch.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Switch);
