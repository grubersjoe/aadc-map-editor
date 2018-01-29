import React from 'react';
import ReactDOM from 'react-dom';

// eslint-disable-next-line import/extensions
import 'typeface-roboto';
import './index.css';

import App from './containers/App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
