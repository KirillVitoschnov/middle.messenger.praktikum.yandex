import { chatAPI } from '../api';
import { store } from '../store';
import { UserType } from '../types';

export class ChatController {
  private sockets: { [chatId: number]: WebSocket } = {};

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

  public createChat(title: string) {
    return chatAPI
      .createChatAPI({ title })
      .then(() => {
        this.getChats();
      })
      .catch((error) => {
        console.error('Ошибка при создании чата:', error);
        store.setState('errorMessage', JSON.parse(error.response as string).reason);
      });
  }

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

  public connectToChat(chatId: number) {
    this.getChatToken(chatId)
      .then((token) => {
        const userId = (store.getState().user as UserType)?.id;
        const socketUrl = `wss://ya-praktikum.tech/ws/chats/${userId}/${chatId}/${token}`;
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
              const reversed = data.reverse();
              store.setState('messages', {
                ...store.getState().messages,
                [chatId]: reversed,
              });
              store.setState('errorMessage', JSON.stringify(reversed));
            } else if (data.type === 'message' || data.type === 'file') {
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
}

export const chatController = new ChatController();
