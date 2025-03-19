export enum StoreEvents {
  Updated = 'updated',
}

import { set } from '../utils';
import { StoreType } from '../types';
import EventBus from '../services/eventBus';
import { deepClone } from '../utils/deepClone';

export class Store extends EventBus<any> {
  private state: StoreType = {
    chats: [],
    errorMessage: '',
    users:[],
    user: {
      id: null,
      first_name: '',
      second_name: '',
      display_name: null,
      login: '',
      avatar: null,
      email: '',
      phone: '',
    },
  };

  public getState() {
    let tmp = deepClone(this.state);
    return tmp;
  }

  public setState(path: string, value: unknown) {
    set(this.state, path, value);
    this.emit(StoreEvents.Updated, this.getState());
  }
}

// Экспортируем единый экземпляр стора
export const store = new Store();
