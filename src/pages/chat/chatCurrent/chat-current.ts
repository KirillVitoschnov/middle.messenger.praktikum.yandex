import * as Service from '../../../services';
import * as Component from '../../../components';
import { TProps } from '../../../types';
import template from '../template.hbs?raw';
import { store } from '../../../store';
import { DateFormatter } from '../../../utils/dateFormatter';
import { chatController } from '../../../controllers';
import {getDataForm, render} from '../../../utils';

export default class ChatCurrent extends Service.Block {
  private socket: WebSocket | null = null;
  private chatId: number;

  constructor(props: TProps) {
    const state = store.getState();
    const chats = state.chats || [];
    const currentChat = chats.find((chatItem) => chatItem.id == props.id) || null;

    super({
      ...props,

      SideBar: new Component.SideBar({
        SideBarHeader: new Component.SideBarHeader({
          sidebarHeaderProfile: new Component.SideBarHeaderProfile({
            events: {
              click: () => {
                Service.router.go('/settings');
              },
            },
          }),
        }),
        SideBarChatList: new Component.SideBarChatList({
          SideBarChatListItem: chats.map((chat) => {
            return new Component.SideBarChatListItem({
              SideBarChatListItemAvatar: new Component.SideBarChatListItemAvatar({
                src: chat.avatar || 'default-avatar.png',
              }),
              SideBarChatListItemInfo: new Component.SideBarChatListItemInfo({
                name: chat.title,
                lastMessage: chat.last_message ? chat.last_message.content : 'Нет сообщений',
                lastMessageTime: chat.last_message
                    ? DateFormatter.formatDateTime(chat.last_message.time)
                    : '',
                SideBarChatListItemBadge:
                    chat.unread_count > 0
                        ? new Component.SideBarChatListItemBadge({ count: chat.unread_count })
                        : null,
                events: {
                  click: () => {
                    // Переходим в другой чат
                    Service.router.go(`/messenger/${chat.id}`);
                  },
                },
              }),
            });
          }),
        }),
        SideBarNewChat: new Component.Button({
          text: 'Новый чат',
          type: 'button',
          events: {
            click: () => {
              const title = window.prompt('Введите название нового чата');
              if (title) {
                chatController.createChat(title);
              }
            },
          },
        }),
      }),

      ActiveChat: new Component.ActiveChat({
        ChatHeader: new Component.ChatHeader({
          chatHeader: (() => {
            const messagesByChat = state.messages?.[props.id] || [];
            return messagesByChat.length > 0
                ? 'Чат ЛОЛ'
                : `Чат с ${currentChat?.title || 'Неизвестный'}`;
          })(),
        }),
        Messages: new Component.Messages({
          Message: (() => {
            const messagesByChat = state.messages?.[props.id] || [];
            return messagesByChat.map((message: any) => {
              return new Component.Message({
                type: message.user_id === state.user?.id ? 'sent' : 'received',
                text: message.content,
                time: DateFormatter.formatDateTime(message.time),
              });
            });
          })(),
        }),
        MessageInput: new Component.MessageInput({
          input: new Component.Input({
            name: 'message',
            placeholder: 'Введите ваше сообщение...',
            events: {
              input: (event: Event) => {
                const inputElement = event.target as HTMLInputElement;
                if (inputElement.value.length > 50) {
                  inputElement.style.border = '2px solid red';
                } else {
                  inputElement.style.border = '1px solid #ccc';
                }
              },
            },
          }),
          button: new Component.Button({
            text: 'Отправить',
            type: 'submit',
            events: {
              click: () => {
                console.log('Нажата кнопка отправки сообщения');
              },
            },
          }),
          events: {
            submit: (event: Event) => {
              event.preventDefault();
              if (Service.validateForm(event)) {
                const formData = getDataForm(event);
                const messageText = formData.message || '';

                if (!messageText) {
                  console.log('Пустое сообщение — не отправляем');
                  return;
                }

                if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                  // Отправляем сообщение только в WebSocket,
                  // не добавляем его дублирующе в стор
                  this.socket.send(
                      JSON.stringify({
                        content: messageText,
                        type: 'message',
                      })
                  );
                  console.log('Сообщение отправлено в WebSocket:', messageText);

                  // Очищаем поле ввода
                  const inputEl = (
                      (this.children.ActiveChat as Component.ActiveChat)
                          .children.MessageInput as Component.MessageInput
                  ).children.input.element as HTMLInputElement;

                  if (inputEl) {
                    inputEl.value = '';
                  }
                } else {
                  console.log('WebSocket соединение не установлено или уже закрыто.');
                }
              }
            },
          },
        }),
      }),

      blockLinks: new Component.BlockLinks({}),
    });

    this.chatId = props.id;

    // Обновляем сообщения при изменении стора
    store.on('updated', () => {
      this.updateMessages();
    });

    this.startChat(this.chatId);
  }

  async startChat(chatId: number) {
    try {
      const token = await chatController.getChatToken(chatId);
      const userId = store.getState().user?.id || 3127;
      const socketUrl = `wss://ya-praktikum.tech/ws/chats/${userId}/${chatId}/${token}`;

      const createSocket = () => {
        const socket = new WebSocket(socketUrl);
        this.socket = socket;

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

            // Если пришёл массив — это «старые» сообщения
            if (Array.isArray(data)) {
              // Разворачиваем массив, чтобы последние сообщения шли внизу
              const reversed = data.reverse();
              store.setState('messages', {
                ...store.getState().messages,
                [chatId]: reversed,
              });
            }
            // Если пришло новое сообщение или файл
            else if (data.type === 'message' || data.type === 'file') {
              const currentMessages = store.getState().messages?.[chatId] || [];
              const newMessages = [...currentMessages, data];

              store.setState('messages', {
                ...store.getState().messages,
                [chatId]: newMessages,
              });
            }
            // Ping/pong или другое — по желанию можно обработать
          } catch (error) {
            console.error('Ошибка обработки входящего сообщения:', error);
          }
        });

        socket.addEventListener('close', (closeEvent: CloseEvent) => {
          if (closeEvent.wasClean) {
            console.log('WS соединение закрыто чисто');
          } else {
            console.log('WS обрыв. Попытка переподключиться через 3 сек...');
            setTimeout(createSocket, 3000);
          }
          console.log(`Код: ${closeEvent.code} | Причина: ${closeEvent.reason}`);
        });

        socket.addEventListener('error', (errorEvent: Event) => {
          console.error('Ошибка в WebSocket:', errorEvent);
        });

        return socket;
      };

      createSocket();
    } catch (error) {
      console.error('Ошибка при инициализации чата:', error);
    }
  }

  updateMessages() {
    const updatedMessages = store.getState().messages?.[this.chatId] || [];
    const activeChat = this.children.ActiveChat as Component.ActiveChat;

    if (!activeChat) {
      return;
    }

    const chatHeader = activeChat.children.ChatHeader as Component.ChatHeader;
    if (chatHeader) {
      chatHeader.setProps({
        chatHeader: updatedMessages.length > 0 ? 'Чат ЛОЛ' : `Чат с ${this.chatId}`,
      });
    }

    const messagesComponent = activeChat.children.Messages as Component.Messages;
    if (messagesComponent) {
      messagesComponent.setProps({
        Message: JSON.parse(JSON.stringify(updatedMessages.map((message: any) => {
          const currentUserId = store.getState().user?.id || 3127;
          return new Component.Message({
            type: message.user_id === currentUserId ? 'sent' : 'received',
            text: message.content,
            time: DateFormatter.formatDateTime(message.time),
          });
        }))),
      });
    }
  }

  public render() {
    return this.compile(template, {
      ...this.props,
    });
  }
}
