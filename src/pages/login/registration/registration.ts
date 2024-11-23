import * as Component from '../../../components';
import * as Service from '../../../services';
import { TProps } from '../../../types';
import template from '../template.hbs?raw';

export default class Registration extends Service.Block {
  constructor(props: TProps) {
    const fieldsProps = [
      {
        label: 'Почта',
        input: new Component.Input({
          type: 'text',
          name: 'email',
          attr: {
            'data-required': true,
            'data-valid-email': true,
          },
          events: {
            blur: (event: FocusEvent) => {
              Service.validate(event.target as HTMLInputElement);
            },
          },
        }),
      },
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
        label: 'Имя',
        input: new Component.Input({
          type: 'text',
          name: 'first_name',
          attr: {
            'data-required': true,
            'data-valid-name': true,
          },
          events: {
            blur: (event: Event) => {
              Service.validate(event.target as HTMLInputElement);
            },
          },
        }),
      },
      {
        label: 'Фамилия',
        input: new Component.Input({
          type: 'text',
          name: 'second_name',
          attr: {
            'data-required': true,
            'data-valid-name': true,
          },
          events: {
            blur: (event: Event) => {
              Service.validate(event.target as HTMLInputElement);
            },
          },
        }),
      },
      {
        label: 'Телефон',
        input: new Component.Input({
          type: 'text',
          name: 'phone',
          attr: {
            'data-required': true,
            'data-max-length': 15,
            'data-min-length': 10,
            'data-valid-phone': true,
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
            blur: (event: FocusEvent) => {
              Service.validate(event.target as HTMLInputElement);
            },
          },
        }),
      },
      {
        label: 'Повторите пароль',
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
            blur: (event: FocusEvent) => {
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
      text: 'Зарегистрироваться',
      attr: { withInternalID: true },
      events: {
        click: () => {
          console.log('button event Зарегистрироваться');
        },
      },
    });

    const link = new Component.Link({
      text: 'Войти',
      href: '/',
      events: {
        click: () => {
          console.log('link event Войти');
        },
      },
    });

    const form = new Component.Form({
      button,
      inputBlocks,
      link,
      events: {
        submit: (event: Event) => {
          Service.validateForm(event);
          if (Service.validateForm(event)) {
            Service.getDataForm(event);
          }
        },
      },
    });

    const Header = new Component.Header({});

    super({
      ...props,
      title: 'Регистрация',
      Header,
      form,
      blockLinks: new Component.BlockLinks({}),
    });
  }

  render() {
    return this.compile(template, { ...this.props });
  }
}
