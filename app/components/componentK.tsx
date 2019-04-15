import * as React from 'react';
import { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { AppStateStore } from '../stores/AppStateStore';

type Props = {

};


@inject('appStateStore')
@observer
export default class ComponentK extends Component<Props> {

  render() {
    const appStateStore = this.props['appStateStore'] as AppStateStore;
    return (
      <>
        <h6>React Mobx Test: {appStateStore.counter}</h6>
        <button onClick={() => appStateStore.upCoutner()}>+</button>
        <button onClick={() => appStateStore.downCounter()}>-</button>
      </>
    );
  }
}
