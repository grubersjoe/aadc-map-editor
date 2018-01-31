import React from 'react';
import { withStyles } from 'material-ui';
import MuiSwitch from 'material-ui/Switch';

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

export default withStyles(styles)(Switch);
