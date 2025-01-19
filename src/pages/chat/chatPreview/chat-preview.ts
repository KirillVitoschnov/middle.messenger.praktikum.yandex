import * as Service from '../../../services';
import * as Component from '../../../components';
import { TProps } from '../../../types';
import template from '../template.hbs?raw';
import {store} from "../../../store";



export default class ChatPreview extends Service.Block {
  constructor(props: TProps) {
    const state = store.getState();
    const chats = state.chats || [];

    super({
      ...props,
      SideBar: new Component.SideBar({
        SideBarHeader: new Component.SideBarHeader({
          sidebarHeaderProfile: new Component.SideBarHeaderProfile({})
        }),
        SideBarChatList: new Component.SideBarChatList({
          SideBarChatListItem: chats.map((chat) =>
              new Component.SideBarChatListItem({
                SideBarChatListItemAvatar: new Component.SideBarChatListItemAvatar({
                  src: chat.avatar || 'default-avatar.png',
                }),
                SideBarChatListItemInfo: new Component.SideBarChatListItemInfo({
                  name: chat.title,
                  lastMessage: chat.last_message ? chat.last_message.text : 'Нет сообщений',
                  lastMessageTime: chat.last_message ? chat.last_message.time : '',
                  SideBarChatListItemBadge:
                      chat.unread_count > 0
                          ? new Component.SideBarChatListItemBadge({
                            count: chat.unread_count,
                          })
                          : null,
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
