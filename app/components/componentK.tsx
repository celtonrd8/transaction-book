import * as React from 'react';
import { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { AppStateStore } from '../stores/AppStateStore';

// import { getConnection } from "typeorm";
import { User } from "../entity/User.entity";

type Props = {

};

type State = {
  data: any[],
};

@inject('appStateStore')
@observer
export default class ComponentK extends Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {
      data: [],
    }
  }

  public getData = async () => {
    const appStateStore = this.props['appStateStore'] as AppStateStore;

    const result = await appStateStore.connect.getRepository(User).find();
    result.map((item => {
      console.log(item.sensorName);
    }));
    if(result) {
      this.setState({data: result});
    }
  };

  render() {
    const appStateStore = this.props['appStateStore'] as AppStateStore;
    const { data } = this.state;

    return (
      <>
        <h6>React Mobx Test: {appStateStore.counter}</h6>
        <button onClick={() => appStateStore.upCoutner()}>+</button>
        <button onClick={() => appStateStore.downCounter()}>-</button>

        <button onClick={this.getData}>data</button>

        { data.map((item, index) => (
          <div key={index}>{item.sensorName}</div>
        ))

        }
      </>
    );
  }
}
