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
      currentPage: 'error-server',
    };
    this.appElement = document.getElementById('app') as HTMLElement;
  }

  render(): void {
    let template:
        | Page.ErrorClient
        | Page.ErrorServer
        | undefined;
    this.appElement.innerHTML = '';

    switch (this.state.currentPage) {
      case 'error-client':
        template = new Page.ErrorClient({ currentPage: this.state.currentPage });
        break;
      case 'error-server':
        template = new Page.ErrorServer({ currentPage: this.state.currentPage });
        break;
      default:
        template = undefined;
    }

    if (template) {
      renderDOM('.app', template);
    }

    this.attachEventListeners();
    this.manageTheme(); // Вызов метода для управления темой
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
    if (!toggleButton) return; // Проверка на наличие кнопки

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
