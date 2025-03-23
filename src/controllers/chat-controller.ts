import { chatAPI } from '../api';
import { store } from '../store';
import { UserType } from '../types';
import { router } from '../services';
import {WEBSOCKET_URL} from '../congfig'
export class ChatController {
  private sockets: { [chatId: number]: WebSocket } = {};

  getChats() {
    return chatAPI
        .getChatsAPI()
        .then((data) => {
          const chats = JSON.parse(data as string);
          store.setState('chats', chats);
          return chats;
        })
        .catch((error) => {
          store.setState('errorMessage', JSON.parse(error.response as string).reason);
        });
  }

  createChat(title: string) {
    return chatAPI
        .createChatAPI({ title })
        .then(() => {
          this.getChats();
        })
        .catch((error) => {
          store.setState('errorMessage', JSON.parse(error.response as string).reason);
        });
  }

  deleteChat(chatId: number) {
    return chatAPI
        .deleteChatAPI(chatId)
        .then(() => {
          if (this.sockets[chatId]) {
            this.sockets[chatId].close();
            delete this.sockets[chatId];
          }
          this.getChats();
          router.go('/messenger');
        })
        .catch((error) => {
          store.setState('errorMessage', JSON.parse(error.response as string).reason);
        });
  }

  getChatToken(chatId: number) {
    return chatAPI
        .getChatTokenAPI(chatId)
        .then((data) => {
          const token = JSON.parse(data as string).token;
          store.setState(`token_${chatId}`, token);
          return token;
        })
        .catch((error) => {
          store.setState('errorMessage', JSON.parse(error.response as string).reason);
        });
  }

  connectToChat(chatId: number) {
    this.getChatToken(chatId).then((token) => {
      const userId = (store.getState().user as UserType)?.id;
      const socketUrl = `${WEBSOCKET_URL}${userId}/${chatId}/${token}`;
      const socket = new WebSocket(socketUrl);
      this.sockets[chatId] = socket;
      socket.addEventListener('open', () => {
        socket.send(JSON.stringify({ content: '0', type: 'get old' }));
      });
      socket.addEventListener('message', (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          if (Array.isArray(data)) {
            const reversed = data.reverse();
            store.setState('messages', { ...store.getState().messages, [chatId]: reversed });
          } else if (data.type === 'message' || data.type === 'file') {
            const current = store.getState().messages?.[chatId];
            const messagesArray = Array.isArray(current) ? current : [];
            const newMessages = [...messagesArray, data];
            store.setState('messages', { ...store.getState().messages, [chatId]: newMessages });
          }
        } catch (e) {}
      });
      socket.addEventListener('close', (closeEvent: CloseEvent) => {
        if (!closeEvent.wasClean) {
          setTimeout(() => this.connectToChat(chatId), 3000);
        }
      });
      socket.addEventListener('error', () => {});
    });
  }

  sendMessage(chatId: number, messageText: string) {
    const socket = this.sockets[chatId];
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ content: messageText, type: 'message' }));
    }
  }

  addUserToChat(users: number[], chatId: number) {
    return chatAPI
        .addUserToChat(users, chatId)
        .then((data) => {
          this.getUsersFromChat(chatId);
          return data;
        })
        .catch((error) => {
          if (error.response) {
            store.setState('errorMessage', JSON.parse(error.response as string).reason);
          }
        });
  }

  getUsersFromChat(chatId: number) {
    return chatAPI
        .getUsersFromChat(chatId)
        .then((data) => {
          store.setState('currentChatUsers', JSON.parse(data as string));
          return data;
        })
        .catch((error) => {
          if (error.response) {
            store.setState('errorMessage', JSON.parse(error.response as string).reason);
          }
        });
  }

  removeUserFromChat(users: number[], chatId: number) {
    return chatAPI
        .removeUserFromChat(users, chatId)
        .then((data) => {
          this.getUsersFromChat(chatId);
          return data;
        })
        .catch((error) => {
          if (error.response) {
            store.setState('errorMessage', JSON.parse(error.response as string).reason);
          }
        });
  }
}

export const chatController = new ChatController();
