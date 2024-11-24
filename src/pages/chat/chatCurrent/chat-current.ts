import * as Service from '../../../services';
import * as Component from '../../../components';
import { TProps } from '../../../types';
import template from '../template.hbs?raw';

export default class ChatCurrent extends Service.Block {
  constructor(props: TProps) {
    super({
      ...props,
      SideBar: new Component.SideBar({
        SideBarHeader: new Component.SideBarHeader({}),
        SideBarChatList: new Component.SideBarChatList({
          SideBarChatListItem: new Component.SideBarChatListItem({
            SideBarChatListItemAvatar:new Component.SideBarChatListItemAvatar({}),
            SideBarChatListItemInfo: new Component.SideBarChatListItemInfo({SideBarChatListItemBadge:new Component.SideBarChatListItemBadge({})}),
          })
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
