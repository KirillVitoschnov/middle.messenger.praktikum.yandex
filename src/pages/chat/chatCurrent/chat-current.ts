import * as Service from '../../../services';
import * as Component from '../../../components';
import { TProps, Chat, Message, AppState } from '../../../types';
import template from '../template.hbs?raw';
import { store } from '../../../store';
import { chatController } from '../../../controllers';
import { getDataForm, isEqual, formatDateTime } from '../../../utils';

interface ChatCurrentChildren {
  AddUserModal: InstanceType<typeof Component.AddUserModal>;
  DeleteUserModal: InstanceType<typeof Component.DeleteUserModal>;
  SideBar: InstanceType<typeof Component.SideBar>;
  ActiveChat: InstanceType<typeof Component.ActiveChat>;
}

export default class ChatCurrent extends Service.Block<TProps> {
  public declare children: ChatCurrentChildren;
  private chatId: number;

  constructor(props: TProps= {}) {
    const chatIdNumber = Number(props.id);
    const state = store.getState() as AppState;
    const chats: Chat[] = state.chats || [];
    super({
      ...props,
      AddUserModal: new Component.AddUserModal({
        isOpen: false,
        chatId: chatIdNumber,
        selectedChatId: chatIdNumber,
        state: state,
      }),
      DeleteUserModal: new Component.DeleteUserModal({
        isOpen: false,
        selectedChatId: chatIdNumber,
      }),
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
          ChatHeaderAddUser: new Component.ChatHeaderButton({
            title: 'Добавить пользователя',
            icon: '/icons/add-user.svg',
            events: {
              click: () => {
                const modal = this.children.AddUserModal;
                modal.setProps({
                  isOpen: true,
                  selectedChatId: chatIdNumber,
                  state: state,
                });
              },
            },
          }),
          ChatHeaderRemoveUser: new Component.ChatHeaderButton({
            title: 'Удалить пользователя',
            icon: '/icons/remove-user.svg',
            events: {
              click: () => {
                const modal = this.children.DeleteUserModal;
                modal.setProps({ isOpen: true, selectedChatId: chatIdNumber });
              },
            },
          }),
          ChatHeaderDeleteChat: new Component.ChatHeaderButton({
            title: 'Удалить чат',
            icon: '/icons/delete-chat.svg',
            events: {
              click: () => {
                if (window.confirm('Вы точно хотите удалить чат?')) {
                  chatController.deleteChat(this.chatId);
                }
              },
            },
          }),
        }),
        Messages: new Component.Messages({
          Message: (() => {
            const messagesByChat: Message[] = state.messages?.[chatIdNumber] || [];
            return messagesByChat.map((message: Message) => {
              return new Component.Message({
                type: message.user_id === (state.user?.id || 0) ? 'sent' : 'received',
                text: message.content,
                time: formatDateTime(message.time),
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
              click: () => {},
            },
          }),
          events: {
            submit: (event: Event) => {
              event.preventDefault();
              if (Service.validateForm(event)) {
                const formData = getDataForm(event);
                const messageText = typeof formData.message === 'string' ? formData.message : '';
                if (!messageText) {
                  return;
                }
                chatController.sendMessage(this.chatId, messageText);
                const activeChat = this.children.ActiveChat;
                const messageInput = (
                    activeChat.children as {
                      MessageInput: InstanceType<typeof Component.MessageInput>;
                    }
                ).MessageInput;
                const inputEl = (
                    messageInput.children as { input: InstanceType<typeof Component.Input> }
                ).input.element as HTMLInputElement;
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
    const sideBarInstance = this.children.SideBar;
    if (sideBarInstance) {
      const updatedSideBarChatList = new Component.SideBarChatList({
        SideBarChatListItem: chats.map((chat: Chat) => {
          return new Component.SideBarChatListItem({
            SideBarChatListItemAvatar: new Component.SideBarChatListItemAvatar({
              src: chat.avatar || '/default-avatar.svg',
            }),
            SideBarChatListItemInfo: new Component.SideBarChatListItemInfo({
              name: chat.title,
              lastMessage: chat.last_message ? chat.last_message.content : 'Нет сообщений',
              lastMessageTime: chat.last_message ? formatDateTime(chat.last_message.time) : '',
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
          });
        }),
      });
      const sideBarChildren = sideBarInstance.children as {
        SideBarHeader: InstanceType<typeof Component.SideBarHeader>;
        SideBarNewChat: InstanceType<typeof Component.Button>;
      };
      sideBarInstance.setChildren({
        SideBarHeader: sideBarChildren.SideBarHeader,
        SideBarChatList: updatedSideBarChatList,
        SideBarNewChat: sideBarChildren.SideBarNewChat,
      });
    }
    const activeChatInstance = this.children.ActiveChat;
    if (activeChatInstance) {
      const updatedChatHeader = new Component.ChatHeader({
        chatHeader: (() => {
          const currentChat: Chat | null =
              chats.find((chatItem: Chat) => chatItem.id === this.chatId) || null;
          return `Чат с ${currentChat?.title || 'Неизвестный'}`;
        })(),
        ChatHeaderAddUser: new Component.ChatHeaderButton({
          title: 'Добавить пользователя',
          icon: '/icons/add-user.svg',
          events: {
            click: () => {
              const modal = this.children.AddUserModal;
              modal.setProps({
                isOpen: true,
                selectedChatId: this.chatId,
                state: state,
              });
            },
          },
        }),
        ChatHeaderRemoveUser: new Component.ChatHeaderButton({
          title: 'Удалить пользователя',
          icon: '/icons/remove-user.svg',
          events: {
            click: () => {
              const modal = this.children.DeleteUserModal;
              modal.setProps({ isOpen: true, selectedChatId: this.chatId });
            },
          },
        }),
        ChatHeaderDeleteChat: new Component.ChatHeaderButton({
          title: 'Удалить чат',
          icon: '/icons/delete-chat.svg',
          events: {
            click: () => {
              if (window.confirm('Вы точно хотите удалить чат?')) {
                chatController.deleteChat(this.chatId);
              }
            },
          },
        }),
      });
      const messagesByChat: Message[] = state.messages?.[this.chatId] || [];
      const updatedMessages = new Component.Messages({
        Message: messagesByChat.map((message: Message) => {
          return new Component.Message({
            type: message.user_id === (state.user?.id || 0) ? 'sent' : 'received',
            text: message.content,
            time: formatDateTime(message.time),
          });
        }),
      });
      const activeChatChildren = activeChatInstance.children as {
        MessageInput: InstanceType<typeof Component.MessageInput>;
      };
      const existingMessageInput = activeChatChildren.MessageInput;
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
