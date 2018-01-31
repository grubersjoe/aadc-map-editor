/* eslint-disable */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Input from 'material-ui/Input';

const KEYCODE_UP = 38;
const KEYCODE_DOWN = 40;
const IS_BROWSER = typeof document !== 'undefined';
const RE_NUMBER = /^[+-]?((\.\d+)|(\d+(\.\d+)?))$/;
const RE_INCOMPLETE_NUMBER = /^([+-]|\.0*|[+-]\.0*|[+-]?\d+\.)?$/;


/**
 * Just a simple helper to provide support for older IEs. This is not exactly a
 * polyfill for classList.add but it does what we need with minimal effort.
 * Works with single className only!
 */
function addClass(element, className) {
  if (element.classList) {
    element.classList.add(className);
  }
  if (!element.className.search(new RegExp(`\\b${className}\\b`))) {
    element.className = ` ${className}`;
  }
}

/**
 * Just a simple helper to provide support for older IEs. This is not exactly a
 * polyfill for classList.remove but it does what we need with minimal effort.
 * Works with single className only!
 */
function removeClass(element, className) {
  if (element.className) {
    if (element.classList) {
      element.classList.remove(className);
    }

    element.className = element.className.replace(
      new RegExp(`\\b${className}\\b`, 'g'),
      '',
    );
  }
}

/**
 * Lookup the object.prop and returns it. If it happens to be a function,
 * executes it with args and returns it's return value. It the prop does not
 * exist on the object, or if it equals undefined, or if it is a function that
 * returns undefined the defaultValue will be returned instead.
 * @param  {Object} object       The object to look into
 * @param  {String} prop         The property name
 * @param  {*}      defaultValue The default value
 * @param  {*[]}    args         Any additional arguments to pass to the
 *                               function (if the prop is a function).
 * @return {*}                   Whatever happens to be the return value
 */
function access(object, prop, defaultValue, ...args) {
  let result = object[prop];
  if (typeof result === 'function') {
    result = result(...args);
  }
  return result === undefined ? defaultValue : result;
}

class NumericInput extends Component {
  static propTypes = {
    step: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
    min: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
    max: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
    precision: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
    maxLength: PropTypes.number,
    parse: PropTypes.func,
    format: PropTypes.func,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
    required: PropTypes.bool,
    snap: PropTypes.bool,
    noValidate: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    noStyle: PropTypes.bool,
    type: PropTypes.string,
    pattern: PropTypes.string,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onKeyDown: PropTypes.func,
    onChange: PropTypes.func,
    onInvalid: PropTypes.func,
    onValid: PropTypes.func,
    onInput: PropTypes.func,
    onSelect: PropTypes.func,
    size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    defaultValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    strict: PropTypes.bool,
    readOnly: PropTypes.bool,
  };

  /**
   * The default behavior is to start from 0, use step of 1 and display
   * integers
   */
  static defaultProps = {
    step: 1,
    min: Number.MIN_SAFE_INTEGER || -9007199254740991,
    max: Number.MAX_SAFE_INTEGER || 9007199254740991,
    precision: null,
    parse: null,
    format: null,
    strict: false,
    readOnly: false,
    style: {},
  };

  /**
   * This are the default styles that act as base for all the component
   * instances. One can modify this object to change the default styles
   * of all the widgets on the page.
   */
  static style = {

    // The wrapper (span)
    wrap: {
      position: 'relative',
      display: 'inline-block',
      // Shame CSS:
      height: 43,
      top: 8,
    },

    // The button arrows (i)
    arrow: {
      position: 'absolute',
      left: 10,
      width: 0,
      height: 0,
      borderStyle: 'solid',
    },

    // The increase button arrow (i)
    arrowUp: {
      bottom: 3,
      borderWidth: '0 0.3em 0.4em',
      borderColor: 'transparent transparent currentColor',
      margin: '1px 0 0 -0.4em',
    },

    // The decrease button arrow (i)
    arrowDown: {
      top: 3,
      borderWidth: '0.4em 0.3em 0',
      borderColor: 'currentColor transparent transparent',
      margin: '0 0 0 -0.4em',
    },

    // Common styles for the up/down buttons (b)
    btn: {
      position: 'absolute',
      right: 0,
      width: 16,
      height: '50%',
      transition: 'all 0.1s',
      // background: 'rgba(0,0,0,.3)',
    },

    btnUp: {
      top: 0,
    },

    btnDown: {
      bottom: 0,
    },

    // 'btn:hover': {
    //   background: 'rgba(0,0,0,.2)',
    // },
    //
    // 'btn:active': {
    //   background: 'rgba(0,0,0,.3)',
    // },

    // 'btn:disabled': {
    //   opacity: 0.5,
    //   cursor: 'not-allowed',
    // },
  };

  /**
   * When click and hold on a button - the speed of auto changing the value.
   * This is a static property and can be modified if needed.
   */
  static SPEED = 100;

  /**
   * When click and hold on a button - the delay before auto changing the value.
   * This is a static property and can be modified if needed.
   */
  static DELAY = 500;

  /**
   * The constant indicating up direction (or increasing in general)
   */
  static DIRECTION_UP = 'up';

  /**
   * The constant indicating down direction (or decreasing in general)
   */
  static DIRECTION_DOWN = 'down';

  /**
   * The step timer
   */
  _timer;

  /**
   * This holds the last known validation error. We need to compare that with
   * new errors and detect validation changes...
   */
  _valid;

  _isStrict;
  _ignoreValueChange;
  _isMounted;
  _inputFocus;
  refsWrapper;
  refsInput;

  /**
   * The state of the component
   */
  state;

  /**
   * Set the initial state and bind this.stop to the instance.
   */
  constructor(...args) {
    super(...args);

    this._isStrict = this.props.strict;

    this.state = {
      btnDownHover: false,
      btnDownActive: false,
      btnUpHover: false,
      btnUpActive: false,
      stringValue: '',
      ...this._propsToState(this.props),
    };
    this.stop = this.stop.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.refsInput = {};
    this.refsWrapper = {};
  }

  _propsToState(props) {
    const out = {};

    if (props.hasOwnProperty('value')) {
      out.stringValue = String(props.value || props.value === 0 ? props.value : '').trim();

      out.value = out.stringValue !== '' ?
        this._parse(props.value) :
        null;
    } else if (!this._isMounted && props.hasOwnProperty('defaultValue')) {
      out.stringValue = String(props.defaultValue || props.defaultValue === 0 ? props.defaultValue : '').trim();

      out.value = props.defaultValue !== '' ?
        this._parse(props.defaultValue) :
        null;
    }

    return out;
  }

  /**
   * Adds getValueAsNumber and setValue methods to the input DOM element.
   */
  componentDidMount() {
    this._isMounted = true;

    if (this.props.readOnly) {
      this.refsInput.readOnly = true;
    }

    this.refsInput.getValueAsNumber = () => this.state.value || 0;

    this.refsInput.setValue = (value) => {
      this.setState({
        value: this._parse(value),
        stringValue: value,
      });
    };

    // This is a special case! If the component has the "autoFocus" prop
    // and the browser did focus it we have to pass that to the onFocus
    if (!this._inputFocus && IS_BROWSER && document.activeElement === this.refsInput) {
      this._inputFocus = true;
      this.refsInput.focus();
      this._invokeEventCallback('onFocus', {
        target: this.refsInput,
        type: 'focus',
      });
    }

    this.checkValidity();
  }

  /**
   * Special care is taken for the "value" prop:
   * - If not provided - set it to null
   * - If the prop is a number - use it as is
   * - Otherwise:
   *     1. Convert it to string (falsy values become "")
   *     2. Then trim it.
   *     3. Then parse it to number (delegating to this.props.parse if any)
   */
  componentWillReceiveProps(props) {
    this._isStrict = !!props.strict;
    const nextState = this._propsToState(props);
    if (Object.keys(nextState).length) {
      this._ignoreValueChange = true;
      this.setState(nextState, () => {
        this._ignoreValueChange = false;
      });
    }
  }

  /**
   * Save the input selection right before rendering
   */
  componentWillUpdate() {
    this.saveSelection();
  }

  /**
   * After the component has been rendered into the DOM, do whatever is
   * needed to "reconnect" it to the outer world, i.e. restore selection,
   * call some of the callbacks, validate etc.
   */
  componentDidUpdate(prevProps, prevState) {
    // Call the onChange if needed. This is placed here because there are
    // many reasons for changing the value and this is the common place
    // that can capture them all
    if (!this._ignoreValueChange // no onChange if re-rendered with different value prop
      && prevState.value !== this.state.value // no onChange if the value remains the same
      && (!Number.isNaN(this.state.value) || this.state.value === null) // only if changing to number or null
    ) {
      this._invokeEventCallback('onChange', this.state.value, this.refsInput.value, this.refsInput);
    }

    // focus the input is needed (for example up/down buttons set
    // this._inputFocus to true)
    if (this._inputFocus) {
      this.refsInput.focus();

      // Restore selectionStart (if any)
      if (this.state.selectionStart || this.state.selectionStart === 0) {
        this.refsInput.selectionStart = this.state.selectionStart;
      }

      // Restore selectionEnd (if any)
      if (this.state.selectionEnd || this.state.selectionEnd === 0) {
        this.refsInput.selectionEnd = this.state.selectionEnd;
      }
    }

    this.checkValidity();
  }

  /**
   * This is used to clear the timer if any
   */
  componentWillUnmount() {
    this._isMounted = false;
    this.stop();
  }

  /**
   * Saves the input selection in the state so that it can be restored after
   * updates
   */
  saveSelection() {
    this.state.selectionStart = this.refsInput.selectionStart;
    this.state.selectionEnd = this.refsInput.selectionEnd;
  }

  /**
   * Unless noValidate is set to true, the component will check the
   * existing validation state (if any) and will toggle the "has-error"
   * CSS class on the wrapper
   */
  checkValidity() {
    let valid;
    let validationError = '';

    const supportsValidation = !!this.refsInput.checkValidity;

    // noValidate
    const noValidate = (
      this.props.noValidate && this.props.noValidate !== 'false'
    );

    this.refsInput.noValidate = noValidate;

    // If "noValidate" is set or "checkValidity" is not supported then
    // consider the element valid. Otherwise consider it invalid and
    // make some additional checks below
    valid = noValidate || !supportsValidation;

    if (valid) {
      validationError = '';
    } else {
      // In some browsers once a pattern is set it cannot be removed. The
      // browser sets it to "" instead which results in validation
      // failures...
      if (this.refsInput.pattern === '') {
        this.refsInput.pattern = this.props.required ? '.+' : '.*';
      }

      // Now check validity
      if (supportsValidation) {
        this.refsInput.checkValidity();
        valid = this.refsInput.validity;

        if (!valid) {
          validationError = this.refsInput.validationMessage;
        }
      }

      // Some browsers might fail to validate maxLength
      if (valid && supportsValidation && this.props.maxLength) {
        if (this.refsInput.value.length > this.props.maxLength) {
          validationError = 'This value is too long';
        }
      }
    }

    validationError = validationError || (
      valid ? '' : this.refsInput.validationMessage || 'Unknown Error'
    );

    const validStateChanged = this._valid !== validationError;
    this._valid = validationError;
    if (validationError) {
      addClass(this.refsWrapper, 'has-error');
      if (validStateChanged) {
        this._invokeEventCallback(
          'onInvalid',
          validationError,
          this.state.value,
          this.refsInput.value,
        );
      }
    } else {
      removeClass(this.refsWrapper, 'has-error');
      if (validStateChanged) {
        this._invokeEventCallback(
          'onValid',
          this.state.value,
          this.refsInput.value,
        );
      }
    }
  }

  /**
   * Used internally to parse the argument x to it's numeric representation.
   * If the argument cannot be converted to finite number returns 0; If a
   * "precision" prop is specified uses it round the number with that
   * precision (no fixed precision here because the return value is float, not
   * string).
   */
  _toNumber(x) {
    let n = parseFloat(x);
    if (Number.isNaN(n) || !Number.isFinite(n)) {
      n = 0;
    }

    if (this._isStrict) {
      const precision = access(this.props, 'precision', null, this);
      const q = 10 ** (precision === null ? 10 : precision);
      const _min = +access(this.props, 'min', NumericInput.defaultProps.min, this);
      const _max = +access(this.props, 'max', NumericInput.defaultProps.max, this);
      n = Math.min(Math.max(n, _min), _max);
      n = Math.round(n * q) / q;
    }

    return n;
  }

  /**
   * This is used internally to parse any string into a number. It will
   * delegate to this.props.parse function if one is provided. Otherwise it
   * will just use parseFloat.
   * @private
   */
  _parse(x) {
    x = String(x);
    if (typeof this.props.parse === 'function') {
      return parseFloat(this.props.parse(x));
    }
    return parseFloat(x);
  }

  /**
   * This is used internally to format a number to it's display representation.
   * It will invoke the this.props.format function if one is provided.
   * @private
   */
  _format(n) {
    let _n = this._toNumber(n);
    const precision = access(this.props, 'precision', null, this);
    if (precision !== null) {
      _n = n.toFixed(precision);
    }

    _n += '';

    if (this.props.format) {
      return this.props.format(_n);
    }

    return _n;
  }

  /**
   * The internal method that actually sets the new value on the input
   * @private
   */
  _step(n, callback) {
    const { _isStrict } = this;
    this._isStrict = true;

    const _step = +access(
      this.props,
      'step',
      NumericInput.defaultProps.step,
      this,
      (
        n > 0 ?
          NumericInput.DIRECTION_UP :
          NumericInput.DIRECTION_DOWN
      ),
    );

    let _n = this._toNumber((this.state.value || 0) + (_step * n));

    if (this.props.snap) {
      _n = Math.round(_n / _step) * _step;
    }

    this._isStrict = _isStrict;

    if (_n !== this.state.value) {
      this.setState({ value: _n, stringValue: `${_n}` }, callback);
      return true;
    }

    return false;
  }

  /**
   * This binds the Up/Down arrow key listeners
   */
  _onKeyDown(...args) {
    args[0].persist();
    this._invokeEventCallback('onKeyDown', ...args);
    const e = args[0];
    if (!e.isDefaultPrevented()) {
      if (e.keyCode === KEYCODE_UP) {
        e.preventDefault();
        this._step(e.ctrlKey || e.metaKey ? 0.1 : e.shiftKey ? 10 : 1);
      } else if (e.keyCode === KEYCODE_DOWN) {
        e.preventDefault();
        this._step(e.ctrlKey || e.metaKey ? -0.1 : e.shiftKey ? -10 : -1);
      } else {
        const { value } = this.refsInput;
        const { length } = value;
        if (e.keyCode === 8) { // backspace
          if (this.refsInput.selectionStart === this.refsInput.selectionEnd &&
            this.refsInput.selectionEnd > 0 &&
            value.length &&
            value.charAt(this.refsInput.selectionEnd - 1) === '.') {
            e.preventDefault();
            this.refsInput.selectionStart = this.refsInput.selectionEnd = this.refsInput.selectionEnd - 1;
          }
        } else if (e.keyCode === 46) { // delete
          if (this.refsInput.selectionStart === this.refsInput.selectionEnd &&
            this.refsInput.selectionEnd < length + 1 &&
            value.length &&
            value.charAt(this.refsInput.selectionEnd) === '.') {
            e.preventDefault();
            this.refsInput.selectionStart = this.refsInput.selectionEnd = this.refsInput.selectionEnd + 1;
          }
        }
      }
    }
  }

  /**
   * Stops the widget from auto-changing by clearing the timer (if any)
   */
  stop() {
    if (this._timer) {
      clearTimeout(this._timer);
    }
  }

  /**
   * Increments the value with one step and the enters a recursive calls
   * after DELAY. This is bound to the mousedown event on the "up" button
   * and will be stopped on mouseout/mouseup.
   * @param {Boolean} _recursive The method is passing this to itself while
   *  it is in recursive mode.
   * @param callback
   * @return void
   */
  increase(_recursive = false, callback) {
    this.stop();
    this._step(1, callback);
    const _max = +access(this.props, 'max', NumericInput.defaultProps.max, this);
    if (Number.isNaN(this.state.value) || +this.state.value < _max) {
      this._timer = setTimeout(() => {
        this.increase(true);
      }, _recursive ? NumericInput.SPEED : NumericInput.DELAY);
    }
  }

  /**
   * Decrements the value with one step and the enters a recursive calls
   * after DELAY. This is bound to the mousedown event on the "down" button
   * and will be stopped on mouseout/mouseup.
   * @param {Boolean} _recursive The method is passing this to itself while
   *  it is in recursive mode.
   * @param callback
   * @return void
   */
  decrease(_recursive = false, callback) {
    this.stop();
    this._step(-1, callback);
    const _min = +access(this.props, 'min', NumericInput.defaultProps.min, this);
    if (Number.isNaN(this.state.value) || +this.state.value > _min) {
      this._timer = setTimeout(() => {
        this.decrease(true);
      }, _recursive ? NumericInput.SPEED : NumericInput.DELAY);
    }
  }

  /**
   * Handles the mousedown event on the up/down buttons. Changes The
   * internal value and sets up a delay for auto increment/decrement
   * (until mouseup or mouseleave)
   */
  onMouseDown(dir, callback) {
    if (dir === 'down') {
      this.decrease(false, callback);
    } else if (dir === 'up') {
      this.increase(false, callback);
    }
  }

  /**
   * Handles the touchstart event on the up/down buttons. Changes The
   * internal value and DOES NOT sets up a delay for auto increment/decrement.
   * Note that this calls e.preventDefault() so the event is not used for
   * creating a virtual mousedown after it
   */
  onTouchStart(dir, e) {
    e.preventDefault();
    if (dir === 'down') {
      this.decrease();
    } else if (dir === 'up') {
      this.increase();
    }
  }

  onTouchEnd(e) {
    e.preventDefault();
    this.stop();
  }

  /**
   * Helper method to invoke event callback functions if they are provided
   * in the props.
   * @param {String} callbackName The name of the function prop
   * @param {*[]} args Any additional argument are passed thru
   */
  _invokeEventCallback(callbackName, ...args) {
    if (typeof this.props[callbackName] === 'function') {
      this.props[callbackName].call(null, ...args);
    }
  }

  /**
   * Renders an input wrapped in relative span and up/down buttons
   * @return {Component}
   */
  render() {
    const { props } = this;
    const { state } = this;
    const css = {};

    const {
      // These are ignored in rendering
      step, min, max, precision, parse, format, snap, value, type, style,
      defaultValue, onInvalid, onValid, strict, size,

      // The rest are passed to the input
      ...rest
    } = this.props;

    const noStyle = this.props.noStyle || style === false;

    // Build the styles
    for (const x in NumericInput.style) {
      css[x] = Object.assign(
        {},
        NumericInput.style[x],
        style ? style[x] || {} : {},
      );
    }

    const attrs = {
      wrap: {
        style: noStyle ? null : css.wrap,
        className: 'react-numeric-input',
        ref: (e) => {
          if (e != null && e !== undefined) {
            this.refsWrapper = e;
          }
        },
        onMouseUp: undefined,
        onMouseLeave: undefined,
      },
      input: {
        inputRef: (el) => {
          if (el != null && el !== undefined) {
            this.refsInput = el;
          }
        },
        type: 'text',
        style: noStyle ? null : Object.assign({}, style, {
          width: `${size}rem`,
        }),
        ...rest,
      },
      btnUp: {
        onMouseEnter: undefined,
        onMouseDown: undefined,
        onMouseUp: undefined,
        onMouseLeave: undefined,
        onTouchStart: undefined,
        onTouchEnd: undefined,
        style: noStyle ? null : Object.assign(
          {},
          css.btn,
          css.btnUp,
          props.disabled || props.readOnly ?
            css['btn:disabled'] :
            state.btnUpActive ?
              css['btn:active'] :
              state.btnUpHover ?
                css['btn:hover'] :
                {},
        ),
      },
      btnDown: {
        onMouseEnter: undefined,
        onMouseDown: undefined,
        onMouseUp: undefined,
        onMouseLeave: undefined,
        onTouchStart: undefined,
        onTouchEnd: undefined,
        style: noStyle ? null : Object.assign(
          {},
          css.btn,
          css.btnDown,
          props.disabled || props.readOnly ?
            css['btn:disabled'] :
            state.btnDownActive ?
              css['btn:active'] :
              state.btnDownHover ?
                css['btn:hover'] :
                {},
        ),
      },
    };

    const stringValue = String(
      // if state.stringValue is set and not empty
      state.stringValue ||

      // else if state.value is set and not null|undefined
      (state.value || state.value === 0 ? state.value : '') ||

      // or finally use ""
      '',
    );

    const loose = !this._isStrict && (this._inputFocus || !this._isMounted);

    if (loose && RE_INCOMPLETE_NUMBER.test(stringValue)) {
      // incomplete number
      attrs.input.value = stringValue;
    } else if (loose && stringValue && !RE_NUMBER.test(stringValue)) {
      // not a number and not empty (loose mode only)
      attrs.input.value = stringValue;
    } else if (state.value || state.value === 0) {
      // number
      attrs.input.value = this._format(state.value);
    } else {
      // empty
      attrs.input.value = '';
    }

    // Attach event listeners if the widget is not disabled
    if (!props.disabled && !props.readOnly) {
      Object.assign(attrs.wrap, {
        onMouseUp: this.stop,
        onMouseLeave: this.stop,
      });

      Object.assign(attrs.btnUp, {
        onTouchStart: this.onTouchStart.bind(this, 'up'),
        onTouchEnd: this.onTouchEnd,
        onMouseEnter: () => {
          this.setState({
            btnUpHover: true,
          });
        },
        onMouseLeave: () => {
          this.stop();
          this.setState({
            btnUpHover: false,
            btnUpActive: false,
          });
        },
        onMouseUp: () => {
          this.setState({
            btnUpHover: true,
            btnUpActive: false,
          });
        },
        onMouseDown: (...args) => {
          args[0].preventDefault();
          args[0].persist();
          this._inputFocus = true;
          this.setState({
            btnUpHover: true,
            btnUpActive: true,
          }, () => {
            this._invokeEventCallback('onFocus', ...args);
            this.onMouseDown('up');
          });
        },
      });

      Object.assign(attrs.btnDown, {
        onTouchStart: this.onTouchStart.bind(this, 'down'),
        onTouchEnd: this.onTouchEnd,
        onMouseEnter: () => {
          this.setState({
            btnDownHover: true,
          });
        },
        onMouseLeave: () => {
          this.stop();
          this.setState({
            btnDownHover: false,
            btnDownActive: false,
          });
        },
        onMouseUp: () => {
          this.setState({
            btnDownHover: true,
            btnDownActive: false,
          });
        },
        onMouseDown: (...args) => {
          args[0].preventDefault();
          args[0].persist();
          this._inputFocus = true;
          this.setState({
            btnDownHover: true,
            btnDownActive: true,
          }, () => {
            this._invokeEventCallback('onFocus', ...args);
            this.onMouseDown('down');
          });
        },
      });

      Object.assign(attrs.input, {
        onChange: (e) => {
          const original = e.target.value;
          let val = this._parse(original);
          if (Number.isNaN(val)) {
            val = null;
          }
          this.setState({
            value: this._isStrict ? this._toNumber(val) : val,
            stringValue: original,
          });
        },
        onKeyDown: this._onKeyDown.bind(this),
        onInput: (...args) => {
          this.saveSelection();
          this._invokeEventCallback('onInput', ...args);
        },
        onSelect: (...args) => {
          this.saveSelection();
          this._invokeEventCallback('onSelect', ...args);
        },
        onFocus: (...args) => {
          args[0].persist();
          this._inputFocus = true;
          const val = this._parse(args[0].target.value);
          this.setState({
            value: val,
            stringValue: val || val === 0 ? `${val}` : '',
          }, () => {
            this._invokeEventCallback('onFocus', ...args);
          });
        },
        onBlur: (...args) => {
          const { _isStrict } = this;
          this._isStrict = true;
          args[0].persist();
          this._inputFocus = false;
          const val = this._parse(args[0].target.value);
          this.setState({
            value: val,
          }, () => {
            this._invokeEventCallback('onBlur', ...args);
            this._isStrict = _isStrict;
          });
        },
      });
    } else if (!noStyle && props.disabled) {
      Object.assign(attrs.input.style, css['input:disabled']);
    }

    return (
      <span {...attrs.wrap}>
        <Input {...attrs.input} />
        <b {...attrs.btnUp}>
          <i style={noStyle ? null : Object.assign(css.arrowUp, css.arrow)} />
        </b>
        <b {...attrs.btnDown}>
          <i style={noStyle ? null : Object.assign(css.arrowDown, css.arrow)} />
        </b>
      </span>
    );
  }
}

export default NumericInput;
