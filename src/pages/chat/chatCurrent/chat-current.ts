import * as Service from '../../../services';
import * as Component from '../../../components';
import { TProps } from '../../../types';
import template from '../template.hbs?raw';
import { store } from '../../../store';
import { DateFormatter } from '../../../utils/dateFormatter';
import { chatController } from '../../../controllers';
import { getDataForm, isEqual } from '../../../utils';

export default class ChatCurrent extends Service.Block<TProps> {
  private chatId: number;

  constructor(props: TProps) {
    // Приводим идентификатор чата к числовому типу
    const chatIdNumber = Number(props.id);
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
            // Ищем чат по числовому идентификатору
            const currentChat = chats.find((chatItem: any) => chatItem.id === chatIdNumber) || null;
            return `Чат с ${currentChat.title || 'Неизвестный'}`
          })(),
        }),
        Messages: new Component.Messages({
          Message: (() => {
            const messagesByChat = state.messages?.[chatIdNumber] || [];
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

    // Сохраняем числовой идентификатор чата
    this.chatId = chatIdNumber;
    chatController.connectToChat(this.chatId);
  }

  override componentDidUpdate(oldProps: TProps, newProps: TProps): boolean {
    if (isEqual(oldProps, newProps)) return false;
    const state = store.getState();
    const chats = state.chats || [];
    const currentChat = chats.find((chatItem: any) => chatItem.id === this.chatId) || null;
    console.log(`currentChat: ${JSON.stringify(currentChat)}`);

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
              }),
              SideBarChatListItemBadge:
                  chat.unread_count > 0
                      ? new Component.SideBarChatListItemBadge({ count: chat.unread_count })
                      : null,
              events: {
                click: () => {
                  Service.router.go(`/messenger/${chat.id}`);
                },
              },
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
          const currentChat = state.chats?.find((chatItem: any) => chatItem.id === this.chatId) || null;
          return `Чат с ${currentChat.title || 'Неизвестный'}`
        })(),
      });

      const updatedMessages = new Component.Messages({
        Message: (() => {
          const messagesByChat = state.messages?.[this.chatId] || [];
          return messagesByChat.map((message: any) =>
              new Component.Message({
                type: message.user_id === state.user?.id ? 'sent' : 'received',
                text: message.content,
                time: DateFormatter.formatDateTime(message.time),
              })
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
