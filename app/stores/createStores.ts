import { AppStateStore } from './AppStateStore';
import { RouterStore } from 'mobx-react-router';

export function createStores() {
  const appStateStore = new AppStateStore();
  const routingStore = new RouterStore();

  return {
    'appStateStore': appStateStore,
    'routingStore': routingStore,
  }

}
