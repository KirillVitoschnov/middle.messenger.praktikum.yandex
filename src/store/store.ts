export enum StoreEvents {
  Updated = 'updated',
}

import { set } from '../utils';
import { StoreType } from '../types';
import EventBus from '../services/eventBus';
import { deepClone } from '../utils/deepClone';

type StoreEventsMap = {
  [StoreEvents.Updated]: [StoreType];
};

export class Store extends EventBus<StoreEventsMap> {
  private state: StoreType = {
    chats: [],
    errorMessage: '',
    users: [],
    currentChatUsers: [],
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

  public getState(): StoreType {
    return deepClone(this.state);
  }

  public setState(path: string, value: unknown): void {
    set(this.state, path, value);
    this.emit(StoreEvents.Updated, this.getState());
  }
}

export const store = new Store();
