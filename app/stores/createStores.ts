import { AppStateStore } from './AppStateStore';
import { RouterStore } from 'mobx-react-router';
import { DataIoStore } from './DataIoStore';

export function createStores() {
  const appStateStore = new AppStateStore();
  const routingStore = new RouterStore();
  const dataIoStore = new DataIoStore();

  return {
    'appStateStore': appStateStore,
    'routingStore': routingStore,
    'dataIoStore': dataIoStore,
  }

}
