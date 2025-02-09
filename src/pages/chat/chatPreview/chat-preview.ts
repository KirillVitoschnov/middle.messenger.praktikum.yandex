import * as Service from '../../../services';
import * as Component from '../../../components';
import { TProps } from '../../../types';
import template from '../template.hbs?raw';
import { store } from '../../../store';
import { DateFormatter } from '../../../utils/dateFormatter';
import { isEqual } from '../../../utils';
import { chatController } from '../../../controllers';

export default class ChatPreview extends Service.Block<TProps> {
  constructor(props: TProps) {
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
          SideBarChatListItem: chats.map((chat: any) =>
              new Component.SideBarChatListItem({
                SideBarChatListItemAvatar: new Component.SideBarChatListItemAvatar({
                  src: chat.avatar || '/default-avatar.svg',
                }),
                SideBarChatListItemInfo: new Component.SideBarChatListItemInfo({
                  name: chat.title,
                  lastMessage: chat.last_message ? chat.last_message.content : 'Нет сообщений',
                  lastMessageTime: chat.last_message
                      ? DateFormatter.formatDateTime(chat.last_message.time)
                      : '',
                  SideBarChatListItemBadge: chat.unread_count > 0
                      ? new Component.SideBarChatListItemBadge({ count: chat.unread_count })
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
        // Добавляем кнопку "Новый чат" с тем же поведением, что и в ChatCurrent
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
      // Остальные дочерние компоненты, характерные для ChatPreview
      chatPanelPlaceholder: new Component.chatPanelPlaceholder({}),
      blockLinks: new Component.BlockLinks({}),
    });
  }

  // Добавляем метод componentDidUpdate для обновления списка чатов в сайдбаре
  override componentDidUpdate(oldProps: TProps, newProps: TProps): boolean {
    if (isEqual(oldProps, newProps)) {
      return false;
    }
    const state = store.getState();
    const chats = state.chats || [];
    const sideBarInstance = this.children.SideBar as any;
    if (sideBarInstance) {
      const updatedSideBarChatList = new Component.SideBarChatList({
        SideBarChatListItem: chats.map((chat: any) =>
            new Component.SideBarChatListItem({
              SideBarChatListItemAvatar: new Component.SideBarChatListItemAvatar({
                src: chat.avatar || '/default-avatar.svg',
              }),
              SideBarChatListItemInfo: new Component.SideBarChatListItemInfo({
                name: chat.title,
                lastMessage: chat.last_message ? chat.last_message.content : 'Нет сообщений',
                lastMessageTime: chat.last_message
                    ? DateFormatter.formatDateTime(chat.last_message.time)
                    : '',
                SideBarChatListItemBadge: chat.unread_count > 0
                    ? new Component.SideBarChatListItemBadge({ count: chat.unread_count })
                    : null,
              }),
              events: {
                click: () => {
                  Service.router.go(`/messenger/${chat.id}`);
                },
              },
            })
        ),
      });

      sideBarInstance.setChildren({
        SideBarHeader: sideBarInstance.children.SideBarHeader,
        SideBarChatList: updatedSideBarChatList,
        SideBarNewChat: sideBarInstance.children.SideBarNewChat,
      });
    }
    return true;
  }

  public render(): DocumentFragment {
    return this.compile(template, {
      ...this.props,
    });
  }
}
