import * as React from 'react';
import { Switch } from 'react-router';
// const routes = require('./constants/routes.json');
import App from './containers/App';

export default () => (
  <App>
    <Switch>
      {/* <Route path={routes.COUNTER} component={CounterPage} />
      <Route path={routes.HOME} component={HomePage} /> */}
    </Switch>
  </App>
);
