import * as Service from '../../../services';
import * as Component from '../../../components';
import { TProps, ChatPreviewChildren, SideBarChildren, Chat } from '../../../types';
import template from '../template.hbs?raw';
import { store } from '../../../store';
import { isEqual, formatDateTime } from '../../../utils';
import { chatController } from '../../../controllers';

interface ChatPreviewProps extends TProps {}

export default class ChatPreview extends Service.Block<ChatPreviewProps> {
  constructor(props: TProps) {
    const state = store.getState();
    const chats: Chat[] = state.chats || [];
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
          SideBarChatListItem: chats.map(
              (chat: Chat) =>
                  new Component.SideBarChatListItem({
                    SideBarChatListItemAvatar: new Component.SideBarChatListItemAvatar({
                      src: chat.avatar || '/default-avatar.svg',
                    }),
                    SideBarChatListItemInfo: new Component.SideBarChatListItemInfo({
                      name: chat.title,
                      lastMessage: chat.last_message ? chat.last_message.content : 'Нет сообщений',
                      lastMessageTime: chat.last_message ? formatDateTime(chat.last_message.time) : '',
                      SideBarChatListItemBadge:
                          chat.unread_count && chat.unread_count > 0
                              ? new Component.SideBarChatListItemBadge({ count: chat.unread_count })
                              : null,
                      events: {
                        click: () => {
                          Service.router.go(`/messenger/${chat.id}`);
                        },
                      },
                    }),
                  }),
          ),
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
      chatPanelPlaceholder: new Component.chatPanelPlaceholder({}),
      blockLinks: new Component.BlockLinks({}),
    });
  }

  override componentDidUpdate(oldProps: ChatPreviewProps, newProps: ChatPreviewProps): boolean {
    if (isEqual(oldProps, newProps)) {
      return false;
    }
    const state = store.getState();
    const chats: Chat[] = state.chats || [];
    const children = this.children as ChatPreviewChildren;
    const sideBarInstance = children.SideBar;
    if (sideBarInstance) {
      const updatedSideBarChatList = new Component.SideBarChatList({
        SideBarChatListItem: chats.map(
            (chat: Chat) =>
                new Component.SideBarChatListItem({
                  SideBarChatListItemAvatar: new Component.SideBarChatListItemAvatar({
                    src: chat.avatar || '/default-avatar.svg',
                  }),
                  SideBarChatListItemInfo: new Component.SideBarChatListItemInfo({
                    name: chat.title,
                    lastMessage: chat.last_message ? chat.last_message.content : 'Нет сообщений',
                    lastMessageTime: chat.last_message ? formatDateTime(chat.last_message.time) : '',
                    SideBarChatListItemBadge:
                        chat.unread_count && chat.unread_count > 0
                            ? new Component.SideBarChatListItemBadge({ count: chat.unread_count })
                            : null,
                  }),
                  events: {
                    click: () => {
                      Service.router.go(`/messenger/${chat.id}`);
                    },
                  },
                }),
        ),
      });
      const sideBarChildren = sideBarInstance.children as SideBarChildren;
      sideBarInstance.setChildren({
        SideBarHeader: sideBarChildren.SideBarHeader,
        SideBarChatList: updatedSideBarChatList,
        SideBarNewChat: sideBarChildren.SideBarNewChat,
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
