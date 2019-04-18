import * as React from 'react';
import { Component } from 'react';
import { Provider } from 'mobx-react';
import { createStores } from './stores';
import * as History from 'history';
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';
import App from './App';

const stores = createStores();

const browserHistory = History.createBrowserHistory();
const routingStore = stores['routingStore'] as RouterStore;
const history = syncHistoryWithStore(browserHistory, routingStore);

type Props = { };

// const stores = createStores();

export default class Root extends Component<Props> {
  render() {
    return (
      <Provider {...stores}>
        <App history={history} />
      </Provider>
    );
  }
}
