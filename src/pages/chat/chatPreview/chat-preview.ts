import * as Service from '../../../services';
import * as Component from '../../../components';
import { TProps } from '../../../types';
import template from '../template.hbs?raw';
import { store } from '../../../store';
import { DateFormatter } from '../../../utils/dateFormatter';
import { isEqual } from '../../../utils';
import { chatController } from '../../../controllers';

/**
 * Интерфейс пропсов для компонента ChatPreview.
 * При необходимости можно расширять дополнительными свойствами.
 */
interface ChatPreviewProps extends TProps {}

/**
 * Интерфейс для дочерних компонентов, используемых в ChatPreview.
 */
interface ChatPreviewChildren {
  SideBar: Component.SideBar;
  chatPanelPlaceholder: Component.chatPanelPlaceholder;
  blockLinks: Component.BlockLinks;
}

/**
 * Интерфейс для дочерних компонентов внутри компонента SideBar.
 */
interface SideBarChildren {
  SideBarHeader: Component.SideBarHeader;
  SideBarChatList: Component.SideBarChatList;
  SideBarNewChat: Component.Button;
}

/**
 * Компонент ChatPreview отображает предварительный вид страницы мессенджера.
 * В нём присутствует боковая панель (SideBar) с заголовком, списком чатов и кнопкой создания нового чата,
 * а также плейсхолдер для области чата (chatPanelPlaceholder) вместо полноценного компонента активного чата.
 */
export default class ChatPreview extends Service.Block<ChatPreviewProps> {
  constructor(props: TProps) {
    // Получаем состояние приложения из store (список чатов)
    const state = store.getState();
    const chats = state.chats || [];

    // Вызываем конструктор базового класса с подготовленными дочерними компонентами.
    // Здесь передаётся боковая панель, плейсхолдер для области чата и дополнительные блоки (например, ссылки).
    super({
      ...props,
      // Боковая панель (SideBar)
      SideBar: new Component.SideBar({
        // Заголовок боковой панели с профилем пользователя
        SideBarHeader: new Component.SideBarHeader({
          sidebarHeaderProfile: new Component.SideBarHeaderProfile({
            events: {
              click: () => {
                Service.router.go('/settings');
              },
            },
          }),
        }),
        // Список чатов, полученных из состояния
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
              })
          ),
        }),
        // Кнопка для создания нового чата
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
      // Плейсхолдер для области чата – в превью активного чата не отображается
      chatPanelPlaceholder: new Component.chatPanelPlaceholder({}),
      // Дополнительные блоки, например, ссылки или другая информация
      blockLinks: new Component.BlockLinks({}),
    });
  }

  /**
   * Метод componentDidUpdate вызывается при обновлении компонента.
   * Здесь происходит обновление списка чатов в боковой панели, если данные изменились.
   */
  override componentDidUpdate(oldProps: ChatPreviewProps, newProps: ChatPreviewProps): boolean {
    if (isEqual(oldProps, newProps)) {
      return false;
    }

    const state = store.getState();
    const chats = state.chats || [];

    // Приводим this.children к типу ChatPreviewChildren для доступа к дочерним компонентам.
    const children = this.children as ChatPreviewChildren;
    const sideBarInstance = children.SideBar;
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
            })
        ),
      });

      // Приводим children боковой панели к типу SideBarChildren
      const sideBarChildren = sideBarInstance.children as SideBarChildren;

      // Обновляем дочерние компоненты боковой панели, сохраняя существующий заголовок и кнопку "Новый чат"
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
