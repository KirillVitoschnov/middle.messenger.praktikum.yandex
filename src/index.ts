import './styles/style.pcss';
import * as Page from './pages';
import { connect, router, routes } from './services';
import { authController, chatController } from './controllers';

/**
 * Функция для управления темой оформления.
 * При загрузке страницы устанавливается сохранённая тема,
 * а по клику на кнопку тема переключается и сохраняется в localStorage.
 */
function manageTheme() {
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

/**
 * Основная инициализация приложения после загрузки DOM.
 */
window.addEventListener('DOMContentLoaded', async () => {
  // Проверяем, авторизован ли пользователь
  const isAuth = await authController.getUserAuth();
  await authController.getUserData();

  // Если пользователь авторизован, получаем список чатов
  if (isAuth) {
    await chatController.getChats();
  }

  /**
   * Функция маппинга данных из стора в пропсы для страниц.
   */
  function mapUserToProps(state: any) {
    const tmpUser = state.user || {};
    const errorMessage = state.errorMessage || null;
    return {
      user: tmpUser,
      chats: state.chats,
      messages: state.messages,
      errorMessage,
    };
  }

  // Настройка роутинга: сопоставляем маршруты с компонентами
  router
    .use(routes.login, connect(Page.Authorization, mapUserToProps))
    .use(routes.signUp, connect(Page.Registration, mapUserToProps))
    .use(routes.settings, connect(Page.ProfileInfo, mapUserToProps))
    .use(routes.settingsEditPassword, connect(Page.ProfileEditPassword, mapUserToProps))
    .use(routes.chat, connect(Page.ChatPreview, mapUserToProps))
    .use(routes.chatCurrent, connect(Page.ChatCurrent, mapUserToProps))
    .use(routes.notFoundPage, connect(Page.ChatPreview, mapUserToProps));

  const pathWindow = window.location.pathname;

  // Если пользователь авторизован, при попытке попасть на главную или страницу регистрации – переадресовываем на настройки
  if (isAuth) {
    if (pathWindow === '/' || pathWindow === '/sign-up') {
      router.go(routes.settings);
    }
  }

  // Если пользователь не авторизован, а запрашивается защищённый маршрут – переадресовываем на страницу логина
  if (!isAuth) {
    if (
      pathWindow === '/messenger' ||
      pathWindow === '/settings' ||
      pathWindow === '/settings/edit-password' ||
      pathWindow.startsWith('/messenger/')
    ) {
      router.go(routes.login);
    }
  }

  // Если текущий путь не соответствует ни одному из маршрутов – показываем страницу "не найдено"
  if (
    !Object.values(routes).some((route) =>
      pathWindow.match(new RegExp(`^${route.replace(/:([a-zA-Z]+)/g, '[^/]+')}$`)),
    )
  ) {
    router.go(routes.notFoundPage);
  }

  // Запускаем роутер
  router.start();

  // Инициализируем переключение темы
  manageTheme();
});
