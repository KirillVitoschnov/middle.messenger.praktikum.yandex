import * as Component from '../../../components';
import * as Service from '../../../services';
import { TProps } from '../../../types';
import template from '../template.hbs?raw';

export default class ProfileEditPassword extends Service.Block {
  constructor(props: TProps) {
    const header = new Component.Header({});

    const inputBlocks = [
      new Component.InputBlock({
        label: 'Старый пароль',
        input: new Component.Input({
          type: 'password',
          name: 'oldPassword',
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
      }),
      new Component.InputBlock({
        label: 'Новый пароль',
        input: new Component.Input({
          type: 'password',
          name: 'newPassword',
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
      }),
      new Component.InputBlock({
        label: 'Повторите новый пароль',
        input: new Component.Input({
          type: 'password',
          name: 'confirmPassword',
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
      }),
    ];

    const saveButton = new Component.Button({
      text: 'Сохранить изменения',
      attr: { withInternalID: true },
      events: {
        click: () => {
          console.log('Сохранить изменения');
        },
      },
    });

    const backButton = new Component.Button({
      text: '← Назад',
      className: 'button-back',
      events: {
        click: () => {
          console.log('Кнопка Назад нажата');
        },
      },
    });

    const link = new Component.Link({
      text: 'Выйти',
      href: '/',
      className: 'profile-link',
      events: {
        click: () => {
          console.log('link event Выйти');
        },
      },
    });

    const form = new Component.Form({
      inputBlocks,
      button: saveButton,
      events: {
        submit: (event: Event) => {
          if (Service.validateForm(event)) {
            console.log(Service.getDataForm(event));
          }
        },
      },
    });

    super({
      ...props,
      header,
      changePasswordLink: null,
      title: 'Изменить пароль',
      form,
      link,
      blockLinks: null,
      backButton,
    });
  }

  render() {
    return this.compile(template, { ...this.props });
  }
}
