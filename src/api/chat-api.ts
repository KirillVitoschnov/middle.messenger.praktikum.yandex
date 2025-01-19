import { ChatType, UserChatType, MessageType } from '../types';
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

    // Добавление пользователя в чат
    addUserToChatAPI(data: UserChatType) {
        return chatAPIInstance.put('/users', {
            isCredentials: true,
            headers: {
                'content-type': 'application/json',
            },
            data: JSON.stringify(data),
        });
    }

    // Удаление пользователя из чата
    removeUserFromChatAPI(data: UserChatType) {
        return chatAPIInstance.delete('/users', {
            isCredentials: true,
            headers: {
                'content-type': 'application/json',
            },
            data: JSON.stringify(data),
        });
    }

    // Получение сообщений чата
    getChatMessagesAPI(chatId: number, token: string) {
        return chatAPIInstance.get(`/messages/${chatId}`, {
            isCredentials: true,
            headers: {
                'content-type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
    }
}

export const chatAPI = new ChatAPI();
