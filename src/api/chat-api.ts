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

  // Получение токена
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
}

export const chatAPI = new ChatAPI();
