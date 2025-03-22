import * as Service from '../services';
import { ChatType } from '../types';

const chatAPIInstance = new Service.HttpClient('https://ya-praktikum.tech/api/v2/chats');

export class ChatAPI extends Service.BaseAPI {
  getChatsAPI() {
    return chatAPIInstance.get('/', {
      isCredentials: true,
      headers: { 'content-type': 'application/json' },
    });
  }

  createChatAPI(data: ChatType) {
    return chatAPIInstance.post('/', {
      isCredentials: true,
      headers: { 'content-type': 'application/json' },
      data: JSON.stringify(data),
    });
  }

  getChatTokenAPI(chatId: number) {
    return chatAPIInstance.post(`/token/${chatId}`, {
      isCredentials: true,
      headers: { 'content-type': 'application/json' },
    });
  }

  deleteChatAPI(chatId: number) {
    return chatAPIInstance.delete('/', {
      isCredentials: true,
      headers: { 'content-type': 'application/json' },
      data: JSON.stringify({ chatId }),
    });
  }

  addUserToChat(users: number[], chatId: number) {
    return chatAPIInstance.put('/users', {
      data: JSON.stringify({ users, chatId }),
      isCredentials: true,
      headers: { 'content-type': 'application/json' },
    });
  }

  getUsersFromChat(chatId: number) {
    return chatAPIInstance.get(`/${chatId}/users`, {
      isCredentials: true,
      headers: { 'content-type': 'application/json' },
    });
  }

  removeUserFromChat(users: number[], chatId: number) {
    return chatAPIInstance.delete('/users', {
      data: JSON.stringify({ users, chatId }),
      isCredentials: true,
      headers: { 'content-type': 'application/json' },
    });
  }
}

export const chatAPI = new ChatAPI();
