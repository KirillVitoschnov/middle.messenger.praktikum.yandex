import { ChatType } from '../types';
import * as Service from '../services';

const chatAPIInstance = new Service.HttpClient('https://ya-praktikum.tech/api/v2/chats');

export class ChatAPI extends Service.BaseAPI {
  // Получение списка чатов
  getChatsAPI() {
    return chatAPIInstance.get('/', {
      isCredentials: true,
      headers: {
        'content-type': 'application/json',
      },
    });
  }

  // Создание нового чата
  createChatAPI(data: ChatType) {
    return chatAPIInstance.post('/', {
      isCredentials: true,
      headers: {
        'content-type': 'application/json',
      },
      data: JSON.stringify(data),
    });
  }

  // Получение токена для подключения к чату по chatId
  getChatTokenAPI(chatId: number) {
    return chatAPIInstance.post(`/token/${chatId}`, {
      isCredentials: true,
      headers: {
        'content-type': 'application/json',
      },
    });
  }

  // Удаление чата
  deleteChatAPI(chatId: number) {
    return chatAPIInstance.delete('/', {
      isCredentials: true,
      headers: {
        'content-type': 'application/json',
      },
      data: JSON.stringify({ chatId }),
    });
  }

  // Добавление пользователя(ей) в чат
  addUserToChat(users: number[], chatId: number) {
    return chatAPIInstance.put('/users', {
      data: JSON.stringify({ users, chatId }),
      isCredentials: true,
      headers: {
        'content-type': 'application/json',
      },
    });
  }

  // Получение списка пользователей в конкретном чате
  getUsersFromChat(chatId: number) {
    return chatAPIInstance.get(`/${chatId}/users`, {
      isCredentials: true,
      headers: {
        'content-type': 'application/json',
      },
    });
  }

  // Удаление пользователя(ей) из чата
  removeUserFromChat(users: number[], chatId: number) {
    return chatAPIInstance.delete('/users', {
      data: JSON.stringify({ users, chatId }),
      isCredentials: true,
      headers: {
        'content-type': 'application/json',
      },
    });
  }
}

export const chatAPI = new ChatAPI();
