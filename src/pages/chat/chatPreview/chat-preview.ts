import * as Service from '../../../services';
import * as Component from '../../../components';
import { TProps } from '../../../types';
import template from '../template.hbs?raw';
import { store } from "../../../store";
import { DateFormatter } from "../../../utils/dateFormatter";

export default class ChatPreview extends Service.Block {
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
