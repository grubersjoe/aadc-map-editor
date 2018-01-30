import React from 'react';
import PropTypes from 'prop-types';
import MuiInput from 'material-ui/Input';
import { withStyles } from 'material-ui/styles';

const Wrapper = (props) => {
  const Input = (props) => {
    const { classes, ...rest } = props;
    return (
      <div className={classes.root}>
        <MuiInput
          className={classes.input}
          {...rest}
        />
        {props.children}
      </div>

    );
  };

  Input.propTypes = {
    classes: PropTypes.object,
    children: PropTypes.node,
  };

  Input.defaultProps = {
    classes: undefined,
    children: undefined,
  };

  const Styled = withStyles(props.style)(Input);

  return (<Styled {...props} />);
};

Wrapper.propTypes = {
  styles: PropTypes.object,
};

Wrapper.defaultProps = {
  styles: undefined,
};

export default Wrapper;
