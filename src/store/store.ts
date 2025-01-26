// src/store/index.ts (примерное название файла)

export enum StoreEvents {
  Updated = 'updated',
}

import { set } from '../utils';
import { StoreType } from '../types';
import EventBus from '../services/eventBus';

export class Store extends EventBus<any> {
  private state: StoreType = {
    chats: [],
    errorMessage: '',
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
    return this.state;
  }

  public setState(path: string, value: unknown) {
    // Используем вашу утилиту set, которая позволяет устанавливать значение по пути 'user.first_name' и т.д.
    set(this.state, path, value);

    // Оповещаем всех подписчиков, что состояние обновилось
    this.emit(StoreEvents.Updated, this.getState());

    console.log('store updated:', this.state);
  }
}

// Экспортируем единый экземпляр стора
export const store = new Store();
