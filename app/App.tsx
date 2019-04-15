import * as React from 'react';
import { Component } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import ComponentK from './components/componentK';
import { inject, observer } from 'mobx-react';
import { History } from 'history';
import { RouterStore } from 'mobx-react-router';

type Props = {
  history: History;
 };

// const stores = createStores();
@inject('routingStore')
@observer
export default class App extends Component<Props> {
  render() {
    const routingStore = this.props['routingStore'] as RouterStore;
    const { history } = this.props;
    return (
      <div>
      <button onClick={() => routingStore.history.push('/')}>/</button>
      <button onClick={() => routingStore.history.push('/d2')}>/d2</button>
      <Router history={history}>
        <Switch>
          <Route exact={true} path='/' component={ComponentK}/>
          <Route path='/d2' component={() => (<div>D2 Component</div>)}/>
        </Switch>
      </Router>
      </div>
    );
  }
}
