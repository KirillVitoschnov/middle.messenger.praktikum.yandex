import * as Service from '../../../services';
import * as Component from '../../../components';
import { TProps, Chat, Message, AppState } from '../../../types';
import template from '../template.hbs?raw';
import { store } from '../../../store';
import { chatController } from '../../../controllers';
import { getDataForm, isEqual, dateFormatter } from '../../../utils';

export default class ChatCurrent extends Service.Block<TProps> {
  private chatId: number;

  constructor(props: TProps) {
    const chatIdNumber = Number(props.id);
    const state = store.getState() as AppState;
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
          SideBarChatListItem: chats.map((chat: Chat) => {
            return new Component.SideBarChatListItem({
              SideBarChatListItemAvatar: new Component.SideBarChatListItemAvatar({
                src: chat.avatar || '/default-avatar.svg',
              }),
              SideBarChatListItemInfo: new Component.SideBarChatListItemInfo({
                name: chat.title,
                lastMessage: chat.last_message ? chat.last_message.content : 'Нет сообщений',
                lastMessageTime: chat.last_message
                  ? dateFormatter.formatDateTime(chat.last_message.time)
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
            const currentChat: Chat | null =
              chats.find((chatItem: Chat) => chatItem.id === chatIdNumber) || null;
            return `Чат с ${currentChat?.title || 'Неизвестный'}`;
          })(),
        }),
        Messages: new Component.Messages({
          Message: (() => {
            const messagesByChat: Message[] = state.messages?.[chatIdNumber] || [];
            return messagesByChat.map((message: Message) => {
              return new Component.Message({
                type: message.user_id === (state.user?.id || 0) ? 'sent' : 'received',
                text: message.content,
                time: dateFormatter.formatDateTime(message.time),
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
                // Используем приведение типов для доступа к дочерним компонентам
                const activeChat = (this.children as any).ActiveChat as Component.ActiveChat;
                const messageInput = (activeChat.children as any)
                  .MessageInput as Component.MessageInput;
                const inputEl = ((messageInput.children as any).input as Component.Input)
                  .element as HTMLInputElement;
                if (inputEl) {
                  inputEl.value = '';
                }
              }
            },
          },
        }),
      }),
    });

    this.chatId = chatIdNumber;
    chatController.connectToChat(this.chatId);
  }

  override componentDidUpdate(oldProps: TProps, newProps: TProps): boolean {
    if (isEqual(oldProps, newProps)) return false;
    const state = store.getState() as AppState;
    const chats: Chat[] = state.chats || [];
    const currentChat: Chat | null =
      chats.find((chatItem: Chat) => chatItem.id === this.chatId) || null;
    console.log(`currentChat: ${JSON.stringify(currentChat)}`);

    // Приведение типа для доступа к SideBar
    const sideBarInstance = (this.children as any).SideBar;
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
                lastMessageTime: chat.last_message
                  ? dateFormatter.formatDateTime(chat.last_message.time)
                  : '',
              }),
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
        ),
      });

      sideBarInstance.setChildren({
        SideBarHeader: sideBarInstance.children.SideBarHeader,
        SideBarChatList: updatedSideBarChatList,
        SideBarNewChat: sideBarInstance.children.SideBarNewChat,
      });
    }

    const activeChatInstance = (this.children as any).ActiveChat;
    if (activeChatInstance) {
      const updatedChatHeader = new Component.ChatHeader({
        chatHeader: (() => {
          const currentChat: Chat | null =
            chats.find((chatItem: Chat) => chatItem.id === this.chatId) || null;
          return `Чат с ${currentChat?.title || 'Неизвестный'}`;
        })(),
      });

      const updatedMessages = new Component.Messages({
        Message: (() => {
          const messagesByChat: Message[] = state.messages?.[this.chatId] || [];
          return messagesByChat.map(
            (message: Message) =>
              new Component.Message({
                type: message.user_id === (state.user?.id || 0) ? 'sent' : 'received',
                text: message.content,
                time: dateFormatter.formatDateTime(message.time),
              }),
          );
        })(),
      });

      const existingMessageInput = activeChatInstance.children.MessageInput;

      activeChatInstance.setChildren({
        ChatHeader: updatedChatHeader,
        Messages: updatedMessages,
        MessageInput: existingMessageInput,
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
