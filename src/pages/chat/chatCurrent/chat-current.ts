import * as Service from '../../../services';
import * as Component from '../../../components';
import { TProps } from '../../../types';
import template from '../template.hbs?raw';
import { store } from '../../../store';
import { DateFormatter } from '../../../utils/dateFormatter';
import { chatController } from '../../../controllers';
import {render} from "../../../utils";

const messages = [
  {
    type: 'sent',
    text: 'Привет! Как у тебя дела?',
  },
  {
    type: 'received',
    text: 'Привет! Все хорошо, спасибо. Как у тебя?',
  },
  {
    type: 'sent',
    text: 'Тоже все отлично! Что нового?',
  },
  {
    type: 'received',
    text: 'Работаю над проектом, а ты?',
  },
  {
    type: 'sent',
    text: 'Тоже занят, но решил написать :)',
  },
  {
    type: 'received',
    text: 'Рада слышать, спасибо, что написал!',
  },
];

export default class ChatCurrent extends Service.Block {
  constructor(props: TProps) {
    const state = store.getState();
    const chats = state.chats || [];
    const currentChat = state.chats.find((item) => item.id == props.id);

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
          SideBarChatListItem: chats.map((chat) =>
              new Component.SideBarChatListItem({
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
                          ? new Component.SideBarChatListItemBadge({
                            count: chat.unread_count,
                          })
                          : null,
                  events: {
                    click: () => {
                      if (chat.id == props.id) {
                        Service.router.go(`/messenger`);
                      } else {
                        Service.router.go(`/messenger/${chat.id}`);
                      }
                    },
                  },
                }),
              })
          ),
        }),
      }),
      ActiveChat: new Component.ActiveChat({
        ChatHeader: new Component.ChatHeader({
          chatHeader: 'Чат с ' + currentChat?.title,
        }),
        Messages: new Component.Messages({
          Message: messages.map(
              (message) =>
                  new Component.Message({
                    type: message.type,
                    text: message.text,
                  })
          ),
        }),

        MessageInput: new Component.MessageInput({
          input: new Component.Input({
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
                console.log('Сообщение отправлено!');
              },
            },
          }),
          events: {
            submit: (event: Event) => {
              Service.validateForm(event);
              if (Service.validateForm(event)) {
                console.log(Service.getDataForm(event));
              }
            },
          },
        }),
      }),
      blockLinks: new Component.BlockLinks({}),
    });

    this.startChat(props.id);
  }

  async startChat(chatId: number) {
    try {
      // Получение токена для чата
      const token = await chatController.getChatToken(chatId);
      const userId = 123; // Используйте реальный userId
      const socketUrl = `wss://ya-praktikum.tech/ws/chats/3127/44269/883f8d92df9e8d4e969aa393bbfff1a11b3acc26:1737310564`;

      // Функция создания WebSocket с переподключением
      const createSocket = () => {
        const socket = new WebSocket(socketUrl);

        // Обработчик успешного подключения
        socket.addEventListener('open', () => {
          console.log('WebSocket connection established');

          // Пример: отправка начального сообщения после подключения
          socket.send(
              JSON.stringify({
                content: "0", // Контент для получения старых сообщений
                type: "get old",
              })
          );
        });

        // Обработчик получения сообщений
        socket.addEventListener('message', (event: MessageEvent) => {
          try {
            const data = JSON.parse(event.data); // Парсинг сообщения

            if (data.type === 'get old') {
              console.log('Получены старые сообщения:', data.content);
              // Логика для отображения старых сообщений
            } else {
              console.log('Получено сообщение от сервера:', data);
              // Логика для обработки других типов сообщений
            }
          } catch (error) {
            console.error('Ошибка обработки сообщения:', error);
          }
        });

        // Обработчик закрытия соединения
        socket.addEventListener('close', (event: CloseEvent) => {
          if (event.wasClean) {
            console.log('Соединение закрыто корректно');
          } else {
            console.log('Обрыв соединения. Переподключение через 3 секунды...');
            setTimeout(createSocket, 3000); // Переподключение через 3 секунды
          }
          console.log(`Код: ${event.code} | Причина: ${event.reason}`);
        });

        // Обработчик ошибок
        socket.addEventListener('error', (event: Event) => {
          console.error('Ошибка WebSocket:', event);
        });

        return socket;
      };

      // Создание WebSocket-соединения
      const socket = createSocket();

      // Функция отправки сообщений через WebSocket
      const sendMessage = (content: string, type: string) => {
        const message = JSON.stringify({ content, type });

        if (socket.readyState === WebSocket.OPEN) {
          socket.send(message);
          console.log('Сообщение отправлено:', message);
        } else {
          console.error('WebSocket не подключен. Невозможно отправить сообщение.');
        }
      };

      // Пример использования sendMessage для отправки сообщения "get old"
      sendMessage("0", "get old");

      console.log('Token получен:', token);
      console.log('props.set:', this.props.set);
    } catch (error) {
      console.error('Ошибка при инициализации чата:', error);
    }
  }



  render() {
    return this.compile(template, {
      ...this.props,
    });
  }
}
