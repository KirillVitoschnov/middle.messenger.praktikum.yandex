import * as Service from '../../../services';
import * as Component from '../../../components';
import { TProps } from '../../../types';
import template from '../template.hbs?raw';
import { store } from '../../../store';
import { DateFormatter } from '../../../utils/dateFormatter';
import { chatController } from '../../../controllers';
import { getDataForm } from '../../../utils';

export default class ChatCurrent extends Service.Block<TProps> {
  private chatId: number;

  constructor(props: TProps) {
    const state = store.getState();
    const chats = state.chats || [];
    const currentChat = chats.find((chatItem) => chatItem.id === props.id) || null;

    super({
      ...props,
      errorMessage: JSON.stringify(props),
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
          SideBarChatListItem: chats.map((chat: any) => {
            return new Component.SideBarChatListItem({
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
                        ? new Component.SideBarChatListItemBadge({ count: chat.unread_count })
                        : null,
                events: {
                  click: () => {
                    Service.router.go(`/messenger/${chat.id}`);
                  },
                },
              }),
            });
          }),
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
      ActiveChat: new Component.ActiveChat({
        ChatHeader: new Component.ChatHeader({
          chatHeader: (() => {
            const messagesByChat = state.messages?.[props.id] || [];
            return messagesByChat.length > 0
                ? 'Чат ЛОЛ'
                : `Чат с ${currentChat?.title || 'Неизвестный'}`;
          })(),
        }),
        Messages: new Component.Messages({
          Message: (() => {
            const messagesByChat = state.messages?.[props.id] || [];
            return messagesByChat.map((message: any) => {
              return new Component.Message({
                type: message.user_id === state.user?.id ? 'sent' : 'received',
                text: message.content,
                time: DateFormatter.formatDateTime(message.time),
              });
            });
          })(),
        }),
        MessageInput: new Component.MessageInput({
          input: new Component.Input({
            name: 'message',
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
                console.log('Нажата кнопка отправки сообщения');
              },
            },
          }),
          events: {
            submit: (event: Event) => {
              event.preventDefault();
              if (Service.validateForm(event)) {
                const formData = getDataForm(event);
                const messageText = formData.message || '';
                if (!messageText) {
                  console.log('Пустое сообщение — не отправляем');
                  return;
                }
                chatController.sendMessage(this.chatId, messageText);
                // Очищаем поле ввода
                const activeChat = this.children.ActiveChat as Component.ActiveChat;
                const messageInput = activeChat.children.MessageInput as Component.MessageInput;
                const inputEl = messageInput.children.input.element as HTMLInputElement;
                if (inputEl) {
                  inputEl.value = '';
                }
              }
            },
          },
        }),
      }),
    });

    this.chatId = props.id;
    chatController.connectToChat(this.chatId);
  }

  /**
   * Метод render возвращает DocumentFragment.
   * В шаблоне для вставки дочерних компонентов следует использовать тройные фигурные скобки,
   * например: {{{SideBar}}} и {{{ActiveChat}}}.
   */
  public render(): DocumentFragment {
    const state = store.getState();
    const chats = state.chats || [];
    const currentChat = chats.find((chatItem) => chatItem.id === this.props.id) || null;

    // Обновляем список чатов в боковой панели (SideBar)
    const sideBarInstance = this.children.SideBar as any;
    if (sideBarInstance) {
      const updatedSideBarChatList = new Component.SideBarChatList({
        SideBarChatListItem: chats.map((chat: any) =>
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
      });
      sideBarInstance.setProps({
        SideBarChatList: updatedSideBarChatList,
      });
    }

    // Обновляем активный чат
    const activeChatInstance = this.children.ActiveChat as any;
    if (activeChatInstance) {
      const updatedChatHeader = new Component.ChatHeader({
        chatHeader: (() => {
          const messagesByChat = state.messages?.[this.props.id] || [];
          return messagesByChat.length > 0
              ? 'Чат ЛОЛ'
              : `Чат с ${currentChat?.title || 'Неизвестный'}`;
        })(),
      });
      const updatedMessages = new Component.Messages({
        Message: (() => {
          const messagesByChat = state.messages?.[this.props.id] || [];
          return messagesByChat.map((message: any) =>
              new Component.Message({
                type: message.user_id === state.user?.id ? 'sent' : 'received',
                text: message.content,
                time: DateFormatter.formatDateTime(message.time),
              })
          );
        })(),
      });
      activeChatInstance.setProps({
        ChatHeader: updatedChatHeader,
        Messages: updatedMessages,
      });
    }

    return this.compile(template, {
      ...this.props,
    });
  }
}
