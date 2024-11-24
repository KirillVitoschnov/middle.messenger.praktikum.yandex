import * as Service from '../../../services';
import * as Component from '../../../components';
import { TProps } from '../../../types';
import template from '../template.hbs?raw';

const chats = [
  {
    name: 'Алиса',
    lastMessage: 'Отлично, спасибо!',
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

export default class ChatPreview extends Service.Block {
  constructor(props: TProps) {
    super({
      ...props,
      SideBar: new Component.SideBar({
        SideBarHeader: new Component.SideBarHeader({}),
        SideBarChatList: new Component.SideBarChatList({
          SideBarChatListItem: chats.map((chat) =>
              new Component.SideBarChatListItem({
                SideBarChatListItemAvatar: new Component.SideBarChatListItemAvatar({
                  src: chat.avatar,
                }),
                SideBarChatListItemInfo: new Component.SideBarChatListItemInfo({
                  name: chat.name,
                  lastMessage: chat.lastMessage,
                  lastMessageTime: chat.lastMessageTime,
                  SideBarChatListItemBadge: new Component.SideBarChatListItemBadge({
                    count: chat.unreadCount,
                  }),
                }),
              })
          ),
        }),
      }),
      chatPanelPlaceholder: new Component.chatPanelPlaceholder({}),
      blockLinks: new Component.BlockLinks({}),
    });
  }

  render() {
    return this.compile(template, {
      ...this.props,
    });
  }
}
