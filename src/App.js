import Handlebars from "handlebars";
import * as Pages from './pages';
import * as Components from './components';

Handlebars.registerPartial('SideBar', Components.SideBar);
Handlebars.registerPartial('Header', Components.Header);
Handlebars.registerPartial('ActiveChat', Components.ActiveChat);
Handlebars.registerPartial('chatPanelPlaceholder', Components.chatPanelPlaceholder);
Handlebars.registerPartial('BlockLinks', Components.BlockLinks);
Handlebars.registerPartial('Input', Components.input);
Handlebars.registerPartial('ChatHeader', Components.ChatHeader);
Handlebars.registerPartial('Messages', Components.Messages);
Handlebars.registerPartial('Message', Components.Message);
Handlebars.registerPartial('MessageInput', Components.MessageInput);
Handlebars.registerPartial('SideBarHeader', Components.SideBarHeader);
Handlebars.registerPartial('SideBarChatList', Components.SideBarChatList);
Handlebars.registerPartial('SideBarChatListItem', Components.SideBarChatListItem);
Handlebars.registerPartial('SideBarChatListItemAvatar', Components.SideBarChatListItemAvatar);
Handlebars.registerPartial('SideBarChatListItemInfo', Components.SideBarChatListItemInfo);
Handlebars.registerPartial('SideBarChatListItemBadge', Components.SideBarChatListItemBadge);

export default class App {
  constructor() {
    this.state = {
      currentPage: 'authorization',
      chats: [
        {
          name: 'Алиса',
          lastMessage: 'Отлично, спасибо!',
          unreadCount: 3,
          lastMessageTime: '12:00',
          avatar: 'https://via.placeholder.com/50'
        },
        {
          name: 'Боб',
          lastMessage: 'Увидимся завтра!',
          unreadCount: 1,
          lastMessageTime: '12:00',
          avatar: 'https://via.placeholder.com/50'
        },
        {
          name: 'Чарли',
          lastMessage: 'Что нового?',
          unreadCount: 5,
          lastMessageTime: '12:00'
        },
      ],
      profile: {
        username: 'KekOFF',
        first_name: 'Кирилл',
        second_name: 'Витошнов',
        display_name: 'Кирилл Витошнов',
        login: 'KekOFF',
        email: 'kvitoshnov@yandex.ru',
        phone: '+7 707 573-49-23',
        avatar: 'https://via.placeholder.com/150',
      },
      messages: [
        { text: 'Привет! Как дела?', type: 'received' },
        { text: 'Привет! Всё хорошо, а у тебя?', type: 'sent' },
        { text: 'Отлично, спасибо!', type: 'received' },
      ],
      commonText: {
        chatHeader: 'Чат с Алисой',
        messagePlaceholder: 'Введите ваше сообщение...',
        sendButton: 'Отправить',
      },
      errors: {
        code: 404,
        message: 'Данной страницы не существует',
      },
    };
    this.appElement = document.getElementById('app');
  }

  render() {
    let template;
    let data = {};

    switch (this.state.currentPage) {
      case 'authorization':
        template = Handlebars.compile(Pages.Authorization);
        data = {
          title: 'Страница авторизации',
          errorMessage: 'Ошибка авторизации. Пожалуйста, проверьте ваши данные.',
        };
        break;
      case 'registration':
        template = Handlebars.compile(Pages.Registration);
        data = {
          title: 'Страница регистрации',
        };
        break;
      case 'profile':
        template = Handlebars.compile(Pages.Profile);
        data = { user: this.state.profile };
        break;
      case 'chats':
        template = Handlebars.compile(Pages.Chats);
        data = {
          title: 'Список чатов',
          chats: this.state.chats,
        };
        break;
      case 'chat':
        template = Handlebars.compile(Pages.Chat);
        data = {
          title: 'Чат',
          ...this.state.commonText,
          messages: this.state.messages,
          chats: this.state.chats,
        };
        break;
      case 'server-error':
        template = Handlebars.compile(Pages.ServerErrorPage);
        data = {
          errorMessage: 'Сервер временно недоступен. Пожалуйста, попробуйте позже.',
        };
        break;
      case 'error':
        template = Handlebars.compile(Pages.ErrorPage);
        data = this.state.errors;
        break;
      default:
        template = Handlebars.compile(Pages.ErrorPage);
        data = this.state.errors;
        break;
    }

    this.appElement.innerHTML = template({
      currentPage: this.state.currentPage,
      ...data,
    });

    this.attachEventListeners();
    this.manageTheme();
  }

  attachEventListeners() {
    const linkNavigation = document.querySelectorAll('.link');
    linkNavigation.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.changePage(e.target.dataset.page);
      });
    });
  }

  changePage(page) {
    this.state.currentPage = page;
    window.scrollTo(0, 0);
    this.render();
  }

  manageTheme() {
    const toggleButton = document.getElementById('theme-toggle');
    const body = document.body;
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
      body.setAttribute('data-theme', savedTheme);
      toggleButton.textContent = `Переключить на ${savedTheme === 'light' ? 'Тёмную' : 'Светлую'} тему`;
    }

    toggleButton.addEventListener('click', () => {
      const currentTheme = body.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      body.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      toggleButton.textContent = `Переключить на ${newTheme === 'light' ? 'Тёмную' : 'Светлую'} тему`;
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.render();
});
