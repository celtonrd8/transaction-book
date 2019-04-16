import { observable, action } from 'mobx';
import { createConnection, Connection } from 'typeorm';
import { User } from '../entity/User.entity';

export class AppStateStore {
  @observable
  public counter = 0;

  public connect: Connection;
  constructor() {

  (async () => {
    this.connect = await createConnection({
      type: 'sqlite',
      synchronize: true,
      logging: true,
      logger: 'simple-console',
      database: './database.sqlite',
      entities: [ User ],
    })
  })();

  }

  @action
  public upCoutner = () => {
    this.counter++;
  }

  @action
  public downCounter = () => {
    this.counter--;
  }

}
