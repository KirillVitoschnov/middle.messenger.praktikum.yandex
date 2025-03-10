import { chatAPI } from '../api';
import { store } from '../store';
import { UserType } from '../types';
import { router } from '../services';

export class ChatController {
    // Храним открытые WebSocket'ы по chatId
    private sockets: { [chatId: number]: WebSocket } = {};

    // Получение списка чатов
    public getChats() {
        return chatAPI
            .getChatsAPI()
            .then((data) => {
                const chats = JSON.parse(data as string);
                store.setState('chats', chats);
                return chats;
            })
            .catch((error) => {
                console.error('Ошибка при получении чатов:', error);
                store.setState('errorMessage', JSON.parse(error.response as string).reason);
            });
    }

    // Создание нового чата
    public createChat(title: string) {
        return chatAPI
            .createChatAPI({ title })
            .then(() => {
                // После создания чата снова запрашиваем актуальный список
                this.getChats();
            })
            .catch((error) => {
                console.error('Ошибка при создании чата:', error);
                store.setState('errorMessage', JSON.parse(error.response as string).reason);
            });
    }

    // Удаление чата
    public deleteChat(chatId: number) {
        return chatAPI
            .deleteChatAPI(chatId)
            .then(() => {
                console.log('Чат успешно удалён');
                this.getChats();
                // Закрываем WebSocket, если чат был в нём
                if (this.sockets[chatId]) {
                    this.sockets[chatId].close();
                    delete this.sockets[chatId];
                }
                router.go('/messenger');
            })
            .catch((error) => {
                console.error('Ошибка при удалении чата', error);
                store.setState('errorMessage', JSON.parse(error.response as string).reason);
            });
    }

    // Получение токена для чата (нужно для WebSocket)
    public getChatToken(chatId: number) {
        return chatAPI
            .getChatTokenAPI(chatId)
            .then((data) => {
                const token = JSON.parse(data as string).token;
                store.setState(`token_${chatId}`, token);
                return token;
            })
            .catch((error) => {
                console.error('Ошибка при получении токена для чата:', error);
                store.setState('errorMessage', JSON.parse(error.response as string).reason);
            });
    }

    // Подключение к чату через WebSocket
    public connectToChat(chatId: number) {
        this.getChatToken(chatId)
            .then((token) => {
                const userId = (store.getState().user as UserType)?.id;
                const socketUrl = `wss://ya-praktikum.tech/ws/chats/${userId}/${chatId}/${token}`;

                // Создаём WebSocket
                const socket = new WebSocket(socketUrl);
                this.sockets[chatId] = socket;

                socket.addEventListener('open', () => {
                    console.log(`WS-соединение установлено (чат ${chatId}). Запрашиваем старые сообщения...`);
                    socket.send(
                        JSON.stringify({
                            content: '0',
                            type: 'get old',
                        }),
                    );
                });

                socket.addEventListener('message', (event: MessageEvent) => {
                    try {
                        const data = JSON.parse(event.data);
                        if (Array.isArray(data)) {
                            // Прилетел массив старых сообщений
                            const reversed = data.reverse();
                            store.setState('messages', {
                                ...store.getState().messages,
                                [chatId]: reversed,
                            });
                            // Для отладки сохраняем в errorMessage
                            store.setState('errorMessage', JSON.stringify(reversed));
                        } else if (data.type === 'message' || data.type === 'file') {
                            // Прилетело новое сообщение
                            const currentMessages = store.getState().messages?.[chatId] || [];
                            const newMessages = [...currentMessages, data];
                            store.setState('messages', {
                                ...store.getState().messages,
                                [chatId]: newMessages,
                            });
                            store.setState('errorMessage', JSON.stringify(newMessages));
                        }
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

    // Отправка сообщения в открытый WebSocket
    public sendMessage(chatId: number, messageText: string) {
        const socket = this.sockets[chatId];
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(
                JSON.stringify({
                    content: messageText,
                    type: 'message',
                }),
            );
            console.log('Сообщение отправлено в WebSocket:', messageText);
        } else {
            console.log('WebSocket соединение не установлено или уже закрыто.');
        }
    }


    // 1. Добавление пользователей(я) в чат
    public addUserToChat(users: number[], chatId: number) {
        return chatAPI
            .addUserToChat(users, chatId)
            .then((data) => {
                console.log('Пользователь(и) успешно добавлен(ы) в чат:', data);
                // Возможно, хотите обновить список пользователей в чате:
                this.getUsersFromChat(chatId);
                return data;
            })
            .catch((error) => {
                console.error('Ошибка при добавлении пользователя(ей) в чат:', error);
                if (error.response) {
                    store.setState('errorMessage', JSON.parse(error.response as string).reason);
                }
            });
    }

    // 2. Получение списка пользователей по chatId
    public getUsersFromChat(chatId: number) {
        return chatAPI
            .getUsersFromChat(chatId)
            .then((data) => {
                console.log('Получен список пользователей чата:', data);
                // При желании сохраним в store
                // const usersList = JSON.parse(data as string);
                // store.setState('chatUsers', usersList);
                return data;
            })
            .catch((error) => {
                console.error('Ошибка при получении списка пользователей чата:', error);
                if (error.response) {
                    store.setState('errorMessage', JSON.parse(error.response as string).reason);
                }
            });
    }

    // 3. Удаление пользователя(ей) из чата
    public removeUserFromChat(users: number[], chatId: number) {
        return chatAPI
            .removeUserFromChat(users, chatId)
            .then((data) => {
                console.log('Пользователь(и) успешно удалён(ы) из чата:', data);
                // Аналогично, можно обновить список пользователей:
                this.getUsersFromChat(chatId);
                return data;
            })
            .catch((error) => {
                console.error('Ошибка при удалении пользователя(ей) из чата:', error);
                if (error.response) {
                    store.setState('errorMessage', JSON.parse(error.response as string).reason);
                }
            });
    }
}

export const chatController = new ChatController();
