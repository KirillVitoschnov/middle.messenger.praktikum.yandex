import { getDataForm } from '../../../utils';
import * as Component from '../../../components';
import * as Service from '../../../services';
import { TProps, UserLoginType } from '../../../types'; // где TProps и UserLoginType корректно описаны
import template from '../template.hbs?raw';
import { authController } from '../../../controllers';

export default class Authorization extends Service.Block {
  constructor(props: TProps = {}) {
    // Подставляем props: TProps = {} по умолчанию,
    // чтобы исключить ситуацию, когда props может быть undefined.

    const fieldsProps = [
      {
        label: 'Логин',
        input: new Component.Input({
          type: 'text',
          name: 'login',
          attr: {
            'data-required': true,
            'data-max-length': 20,
            'data-min-length': 3,
            'data-valid-login': true,
          },
          events: {
            blur: (event: Event) => {
              // Явно указываем тип Event, чтобы убрать ошибку про any.
              Service.validate(event.target as HTMLInputElement);
            },
          },
        }),
      },
      {
        label: 'Пароль',
        input: new Component.Input({
          type: 'password',
          name: 'password',
          attr: {
            'data-required': true,
            'data-max-length': 40,
            'data-min-length': 8,
            'data-valid-password': true,
          },
          events: {
            blur: (event: Event) => {
              Service.validate(event.target as HTMLInputElement);
            },
          },
        }),
      },
    ];

    const inputBlocks = fieldsProps.map(
        (field) => new Component.InputBlock(field)
    );

    const button = new Component.Button({
      text: 'Авторизация',
      type: 'submit',
      withInternalId: true,
    });

    const link = new Component.Link({
      text: 'Нет аккаунта?',
      href: '/sign-up',
      events: {
        click: () => {
          Service.router.go(Service.routes.signUp);
        },
      },
    });

    const form = new Component.Form({
      button,
      inputBlocks,
      link,
      events: {
        submit: (event: Event) => {
          event.preventDefault();

          // Вызываем валидацию формы
          if (Service.validateForm(event)) {
            // Если валидация пройдена, собираем данные формы
            const data = getDataForm(event);
            // Передаём данные (login, password) в контроллер
            // Предполагается, что authController.login ожидает UserLoginType
            authController.login(data as UserLoginType);
          }
        },
      },
    });

    const Header = new Component.Header({});

    super({
      title: 'Авторизация',
      form,
      errorMessage: props.errorMessage, // props теперь не будет undefined
      Header,
      blockLinks: new Component.BlockLinks({}),
    });
  }

  override render() {
    return this.compile(template, { ...this.props });
  }
}
