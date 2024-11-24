import * as Service from '../../../services';
import * as Component from '../../../components';
import { TProps } from '../../../types';
import template from '../template.hbs?raw';

const chats = [
  {
    name: 'Алиса',
    lastMessage: 'Рада слышать, спасибо, что написал!',
    unreadCount: 3,
    lastMessageTime: '12:00',
    avatar: 'https://via.placeholder.com/50',
  },
  {
    name: 'Боб',
    lastMessage: 'Увидимся завтра!',
    unreadCount: 1,
    lastMessageTime: '12:00',
    avatar: 'https://via.placeholder.com/50',
  },
  {
    name: 'Чарли',
    lastMessage: 'Что нового?',
    unreadCount: 5,
    lastMessageTime: '12:00',
    avatar: 'https://via.placeholder.com/50',
  },
  {
    name: 'Даниил',
    lastMessage: 'На связи через минуту.',
    unreadCount: 2,
    lastMessageTime: '09:30',
    avatar: 'https://via.placeholder.com/50',
  },
  {
    name: 'Екатерина',
    lastMessage: 'Ты видел это?',
    unreadCount: 0,
    lastMessageTime: '11:45',
    avatar: 'https://via.placeholder.com/50',
  },
  {
    name: 'Фёдор',
    lastMessage: 'Привет, как дела?',
    unreadCount: 4,
    lastMessageTime: '10:15',
    avatar: 'https://via.placeholder.com/50',
  },
  {
    name: 'Григорий',
    lastMessage: 'Отправил файл, проверь.',
    unreadCount: 1,
    lastMessageTime: '08:50',
    avatar: 'https://via.placeholder.com/50',
  },
  {
    name: 'Анна',
    lastMessage: 'Отлично, спасибо!',
    unreadCount: 0,
    lastMessageTime: '07:20',
    avatar: 'https://via.placeholder.com/50',
  },
  {
    name: 'Михаил',
    lastMessage: 'Согласен, давай так.',
    unreadCount: 6,
    lastMessageTime: '12:15',
    avatar: 'https://via.placeholder.com/50',
  },
  {
    name: 'Виктория',
    lastMessage: 'До встречи!',
    unreadCount: 3,
    lastMessageTime: '14:00',
    avatar: 'https://via.placeholder.com/50',
  },
  {
    name: 'Игорь',
    lastMessage: 'Это срочно!',
    unreadCount: 8,
    lastMessageTime: '15:30',
    avatar: 'https://via.placeholder.com/50',
  },
  {
    name: 'Ольга',
    lastMessage: 'Позже расскажу.',
    unreadCount: 0,
    lastMessageTime: '16:00',
    avatar: 'https://via.placeholder.com/50',
  },
  {
    name: 'Павел',
    lastMessage: 'Все готово.',
    unreadCount: 2,
    lastMessageTime: '17:45',
    avatar: 'https://via.placeholder.com/50',
  },
];

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
    super({
      ...props,
      SideBar: new Component.SideBar({
        SideBarHeader: new Component.SideBarHeader({}),
        SideBarChatList: new Component.SideBarChatList({
          SideBarChatListItem: chats.map(
            (chat) =>
              new Component.SideBarChatListItem({
                SideBarChatListItemAvatar: new Component.SideBarChatListItemAvatar({
                  src: chat.avatar,
                }),
                SideBarChatListItemInfo: new Component.SideBarChatListItemInfo({
                  name: chat.name,
                  lastMessage: chat.lastMessage,
                  lastMessageTime: chat.lastMessageTime,
                  SideBarChatListItemBadge:
                    chat.unreadCount > 0
                      ? new Component.SideBarChatListItemBadge({
                          count: chat.unreadCount,
                        })
                      : null,
                }),
              }),
          ),
        }),
      }),
      ActiveChat: new Component.ActiveChat({
        ChatHeader: new Component.ChatHeader({ chatHeader: 'Чат с Алисой' }),
        Messages: new Component.Messages({
          Message: messages.map(
            (message) =>
              new Component.Message({
                type: message.type,
                text: message.text,
              }),
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
  }

  render() {
    return this.compile(template, {
      ...this.props,
    });
  }
}
