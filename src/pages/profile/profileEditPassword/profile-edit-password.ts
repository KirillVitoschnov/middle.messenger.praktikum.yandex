import * as Component from '../../../components';
import * as Service from '../../../services';
import { TProps } from '../../../types';
import template from '../template.hbs?raw';
import {userController} from '../../../controllers';
import { getDataForm } from '../../../utils';

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
    });

    const backButton = new Component.Button({
      text: '← Назад',
      className: 'button-back',
      events: {
        click: () => {
          Service.router.go('/settings');
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

    // Форма со всеми полями
    const form = new Component.Form({
      inputBlocks,
      button: saveButton,
      events: {
        submit: async (event: Event) => {
          event.preventDefault();
          if (Service.validateForm(event)) {
            const formData = getDataForm(event) as {
              oldPassword: string;
              newPassword: string;
              confirmPassword: string;
            };
            if (formData.newPassword !== formData.confirmPassword) {
              alert('Новый пароль и подтверждение не совпадают!');
              return;
            }

            try {
              await userController.changePassword({
                oldPassword: formData.oldPassword,
                newPassword: formData.newPassword,
              });
            } catch (error) {
              console.error('Ошибка при изменении пароля:', error);
              alert('Не удалось изменить пароль. Попробуйте ещё раз.');
            }
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
