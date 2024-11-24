import * as Page from './pages';
import { renderDOM } from './services';

interface AppState {
  currentPage: string;
}

export default class App {
  state: AppState;
  appElement: HTMLElement;

  constructor() {
    this.state = {
      currentPage: 'authorization',
    };
    this.appElement = document.getElementById('app') as HTMLElement;
  }

  render(): void {
    let template:
      | Page.Authorization
      | Page.Registration
      | Page.ProfileInfo
      | Page.ProfileEditPassword
      | Page.ErrorClient
      | Page.ErrorServer
      | Page.ChatPreview
      | Page.ChatCurrent
      | undefined;
    this.appElement.innerHTML = '';

    switch (this.state.currentPage) {
      case 'authorization':
        template = new Page.Authorization({ currentPage: this.state.currentPage });
        break;
      case 'registration':
        template = new Page.Registration({ currentPage: this.state.currentPage });
        break;
      case 'profile':
        template = new Page.ProfileInfo({ currentPage: this.state.currentPage });
        break;
      case 'profile-edit-password':
        template = new Page.ProfileEditPassword({ currentPage: this.state.currentPage });
        break;
      case 'error-client':
        template = new Page.ErrorClient({ currentPage: this.state.currentPage });
        break;
      case 'error-server':
        template = new Page.ErrorServer({ currentPage: this.state.currentPage });
        break;
      case 'chat-preview':
        template = new Page.ChatPreview({ currentPage: this.state.currentPage });
        break;
      case 'chat-current':
        template = new Page.ChatCurrent({ currentPage: this.state.currentPage });
        break;
      default:
        template = undefined;
    }

    if (template) {
      renderDOM('.app', template);
    }

    this.attachEventListeners();
    this.manageTheme();
  }

  attachEventListeners(): void {
    const linkNavigation = document.querySelectorAll('.link')!;
    linkNavigation.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.changePage((e.target as HTMLLinkElement).dataset.page!);
      });
    });
  }

  changePage(page: string): void {
    this.state.currentPage = page;
    this.render();
  }

  manageTheme(): void {
    const toggleButton = document.getElementById('theme-toggle');
    if (!toggleButton) return;

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
