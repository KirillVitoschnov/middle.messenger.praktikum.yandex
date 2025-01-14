import { getDataForm } from '../../../utils';
import * as Component from '../../../components';
import * as Service from '../../../services';
import { TProps, UserLoginType } from '../../../types';
import template from '../template.hbs?raw';
import { authController } from '../../../controllers';

export default class Authorization extends Service.Block {
  constructor(props?: TProps) {
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
            blur: (event) => {
              Service.validate(event.target as HTMLInputElement);
            },
          },
        }),
      },
    ];
    const inputBlocks = fieldsProps.map((field) => {
      return new Component.InputBlock(field);
    });

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
          Service.validateForm(event);
          if (Service.validateForm(event)) {
            const data = getDataForm(event);
            authController.login(data as UserLoginType);
          }
        },
      },
    });
    const Header = new Component.Header({});
    console.log(props)
    super({
      title: 'Авторизация',
      form,
      errorMessage:JSON.stringify(props),
      Header,
      blockLinks: new Component.BlockLinks({}),
    });
  }

  override render() {
    return this.compile(template, { ...this.props });
  }
}
