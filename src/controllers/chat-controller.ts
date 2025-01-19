import { chatAPI } from '../api';
import { router } from '../services';
import { store } from '../store';

export class ChatController {
    // Получить список чатов
    public getChats() {
        return chatAPI
            .getChatsAPI()
            .then((data) => {
                console.log(data);
                store.setState('chats', JSON.parse(data));
                return JSON.parse(data);
            })
            .catch((error) => {
                console.error('Ошибка при получении чатов:', error);
                store.setState('errorMessage', JSON.parse(error.response).reason);
            });
    }

    // Создать новый чат
    public createChat(title: string) {
        return chatAPI
            .createChatAPI({ title })
            .then(() => {
                this.getChats(); // Обновляем список чатов
            })
            .catch((error) => {
                console.error('Ошибка при создании чата:', error);
                store.setState('errorMessage', JSON.parse(error.response).reason);
            });
    }

    // Удалить чат по ID
    public deleteChat(chatId: number) {
        return chatAPI
            .deleteChatAPI(chatId)
            .then(() => {
                this.getChats(); // Обновляем список чатов после удаления
            })
            .catch((error) => {
                console.error('Ошибка при удалении чата:', error);
                store.setState('errorMessage', JSON.parse(error.response).reason);
            });
    }

    // Добавить пользователя в чат
    public addUserToChat(chatId: number, userId: number) {
        return chatAPI
            .addUserToChatAPI({ chatId, userId })
            .then(() => {
                console.log(`Пользователь ${userId} добавлен в чат ${chatId}`);
            })
            .catch((error) => {
                console.error('Ошибка при добавлении пользователя в чат:', error);
                store.setState('errorMessage', JSON.parse(error.response).reason);
            });
    }

    // Удалить пользователя из чата
    public removeUserFromChat(chatId: number, userId: number) {
        return chatAPI
            .removeUserFromChatAPI({ chatId, userId })
            .then(() => {
                console.log(`Пользователь ${userId} удалён из чата ${chatId}`);
            })
            .catch((error) => {
                console.error('Ошибка при удалении пользователя из чата:', error);
                store.setState('errorMessage', JSON.parse(error.response).reason);
            });
    }

    // Получить сообщения чата по ID
    public getChatMessages(chatId: number) {
        return chatAPI
            .getChatMessagesAPI(chatId)
            .then((data) => {
                store.setState(`messages_${chatId}`, JSON.parse(data));
                return JSON.parse(data);
            })
            .catch((error) => {
                console.error('Ошибка при получении сообщений чата:', error);
                store.setState('errorMessage', JSON.parse(error.response).reason);
            });
    }
}

export const chatController = new ChatController();
