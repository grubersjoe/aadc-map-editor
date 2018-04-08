import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, CircularProgress, withStyles } from 'material-ui';
import { parseXmlTagsFromUrl, XmlTags } from '../services/Xml';

const styles = theme => ({
  wrapper: {
    marginLeft: theme.spacing.unit * 4,
    marginRight: theme.spacing.unit * 4,
    position: 'relative',
  },
  button: {
    '&:disabled': {
      color: theme.palette.primary.light,
    },
  },
  progress: {
    color: theme.palette.secondary.main,
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
});

class LoadExample extends Component {
  state = {
    loading: false,
  };

  loadExample = async () => {
    this.setState({ loading: true });
    // eslint-disable-next-line global-require
    const exampleFile = require('../tests/example.xml');
    const mapElems = await parseXmlTagsFromUrl(exampleFile, [
      XmlTags.TILE,
      XmlTags.ROAD_SIGN,
      XmlTags.PEDESTRIAN_CROSSING,
    ]);
    this.setState({ loading: false });
    this.props.setMapElems(mapElems, true);
  };

  render() {
    const { loading } = this.state;
    const { classes } = this.props;

    return (
      <div className={classes.wrapper}>
        <Button
          size="small"
          color="inherit"
          className={classes.button}
          disabled={loading}
          onClick={this.loadExample}
        >
          Load Example
        </Button>
        {loading &&
        <CircularProgress size={24} className={classes.progress} />}
      </div>
    );
  };
}

LoadExample.propTypes = {
  classes: PropTypes.object.isRequired,
  setMapElems: PropTypes.func.isRequired,
};

export default withStyles(styles, { withTheme: true })(LoadExample);
