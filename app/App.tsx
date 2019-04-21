import * as React from 'react';
import { Component } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
// import { inject, observer } from 'mobx-react';
import { History } from 'history';

import { AppBar } from './components/AppBar';
import { MainContainer } from './containers';

type Props = {
  history: History;
 };

// const stores = createStores();
// @inject('routingStore')
// @observer
export default class App extends Component<Props> {
  render() {
    // const routingStore = this.props['routingStore'] as RouterStore;
    const { history } = this.props;
    return (
      <div>
        <AppBar />
        <Router history={history}>
          <Switch>
            <Route path='/' component={MainContainer}/>
            {/* <Route exact={true} path='/main' component={MainContainer}/> */}
          </Switch>
        </Router>
      </div>
    );
  }
}
