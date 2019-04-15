import { observable, action } from 'mobx';

export class AppStateStore {
  @observable
  public counter = 0;

  @action
  public upCoutner = () => {
    this.counter++;
  }

  @action
  public downCounter = () => {
    this.counter--;
  }

}
