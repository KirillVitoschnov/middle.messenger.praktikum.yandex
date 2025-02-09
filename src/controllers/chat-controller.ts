// controllers/chatController.ts

import { chatAPI } from '../api';
import { router } from '../services';
import { store } from '../store';

export class ChatController {
    // Объект для хранения WebSocket-соединений по ID чата
    private sockets: { [chatId: number]: WebSocket } = {};

    public getChats() {
        return chatAPI
            .getChatsAPI()
            .then((data) => {
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

    // Получить сообщения чата по ID (если необходимо использовать HTTP-запросы)
    public getChatMessages(chatId: number) {
        return this.getChatToken(chatId)
            .then((token) => {
                return chatAPI
                    .getChatMessagesAPI(chatId, token)
                    .then((data) => {
                        store.setState(`messages_${chatId}`, JSON.parse(data));
                        return JSON.parse(data);
                    });
            })
            .catch((error) => {
                console.error('Ошибка при получении сообщений чата:', error);
                store.setState('errorMessage', JSON.parse(error.response).reason);
            });
    }

    // Получить токен для чата
    public getChatToken(chatId: number) {
        return chatAPI
            .getChatTokenAPI(chatId)
            .then((data) => {
                const token = JSON.parse(data).token;
                store.setState(`token_${chatId}`, token);
                return token;
            })
            .catch((error) => {
                console.error('Ошибка при получении токена для чата:', error);
                store.setState('errorMessage', JSON.parse(error.response).reason);
            });
    }

    // ★ Новый метод: подключение к чату через WebSocket
    public connectToChat(chatId: number) {
        this.getChatToken(chatId)
            .then((token) => {
                const userId = store.getState().user?.id || 3127;
                const socketUrl = `wss://ya-praktikum.tech/ws/chats/${userId}/${chatId}/${token}`;
                const socket = new WebSocket(socketUrl);
                this.sockets[chatId] = socket;

                socket.addEventListener('open', () => {
                    console.log(`WS-соединение установлено (чат ${chatId}). Запрашиваем старые сообщения...`);
                    socket.send(
                        JSON.stringify({
                            content: '0',
                            type: 'get old',
                        })
                    );
                });

                socket.addEventListener('message', (event: MessageEvent) => {
                    try {
                        const data = JSON.parse(event.data);
                        // Если пришёл массив – это «старые» сообщения
                        if (Array.isArray(data)) {
                            // Разворачиваем массив, чтобы последние сообщения шли внизу
                            const reversed = data.reverse();
                            store.setState('messages', {
                                ...store.getState().messages,
                                [chatId]: reversed,
                            });
                            store.setState('errorMessage', JSON.stringify(reversed));

                        }
                        // Если пришло новое сообщение или файл
                        else if (data.type === 'message' || data.type === 'file') {
                            const currentMessages = store.getState().messages?.[chatId] || [];
                            const newMessages = [...currentMessages, data];
                            store.setState('messages', {
                                ...store.getState().messages,
                                [chatId]: newMessages,
                            });
                            store.setState('errorMessage', JSON.stringify(newMessages));

                        }

                        // Дополнительная обработка (например, ping/pong) при необходимости
                    } catch (error) {
                        console.error('Ошибка обработки входящего сообщения:', error);
                    }
                });

                socket.addEventListener('close', (closeEvent: CloseEvent) => {
                    if (!closeEvent.wasClean) {
                        console.log('WS обрыв. Попытка переподключиться через 3 сек...');
                        setTimeout(() => this.connectToChat(chatId), 3000);
                    }
                    console.log(`Код: ${closeEvent.code} | Причина: ${closeEvent.reason}`);
                });

                socket.addEventListener('error', (errorEvent: Event) => {
                    console.error('Ошибка в WebSocket:', errorEvent);
                });
            })
            .catch((error) => {
                console.error('Ошибка при подключении к чату:', error);
            });
    }

    // ★ Новый метод: отправка сообщения через WebSocket
    public sendMessage(chatId: number, messageText: string) {
        const socket = this.sockets[chatId];
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(
                JSON.stringify({
                    content: messageText,
                    type: 'message',
                })
            );
            console.log('Сообщение отправлено в WebSocket:', messageText);
        } else {
            console.log('WebSocket соединение не установлено или уже закрыто.');
        }
    }
}

export const chatController = new ChatController();
