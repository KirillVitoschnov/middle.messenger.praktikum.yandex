import * as Service from '../../../services';
import * as Component from '../../../components';
import { TProps } from '../../../types';
import template from '../template.hbs?raw';
import {store} from "../../../store";
import {DateFormatter} from "../../../utils/dateFormatter";



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
    console.log(props)
    console.log('lol')
    const state = store.getState();
    const chats = state.chats || [];
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
                      Service.router.go(`/messenger/${chat.id}`);
                    },
                  },
                }),
              })
          ),
        }),
      }),
      ActiveChat: new Component.ActiveChat({
        ChatHeader: new Component.ChatHeader({ chatHeader: 'Чат с Алисой'+JSON.stringify(props.id) }),
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
