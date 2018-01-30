import React, { Component } from 'react';
import PropTypes from 'prop-types';

const styles = {
  label: {
    fontSize: '80%',
  },
  input: {
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: 30,
    fontWeight: 300,
  },
};

class NumberInput extends Component {
  state = {
    value: this.props.value,
  };

  handleUpdate = (e) => {
    if (e.target.validity.valid) {
      const value = Number.parseFloat(e.target.value);
      const { onChange } = this.props;

      this.setState({ value });

      if (typeof onChange === 'function') {
        this.props.onChange(value, e);
      }
    }
  };

  render = () => {
    const {
      label, size, min, max, step, style,
    } = this.props;

    return (
      <span>
        {label && <label style={styles.label}>{label}</label>}
        <input
          type="number"
          value={this.state.value}
          step={step}
          min={min}
          max={max}
          style={
            Object.assign({}, styles.input, style.input, {
              // width: `${size + 1}rem`,
            })
          }
          onChange={this.handleUpdate}
          ref={(input) => {
            this.input = input;
          }}
        />
      </span>
    );
  };
}

NumberInput.propTypes = {
  label: PropTypes.string,
  value: PropTypes.number.isRequired,
  size: PropTypes.number,
  step: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number,
  style: PropTypes.object,
  onChange: PropTypes.func,
};

NumberInput.defaultProps = {
  label: undefined,
  step: 1,
  size: 2,
  min: 0,
  max: 10,
  onChange: undefined,
};

export default NumberInput;
