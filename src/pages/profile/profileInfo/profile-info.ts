import * as Component from '../../../components';
import * as Service from '../../../services';
import template from '../template.hbs?raw';
import { store } from '../../../store';
import { getDataForm } from '../../../utils';
import { userController, authController } from '../../../controllers';
import { UserType } from '../../../types';
import {BASE_URL} from "../../../congfig";

export type TProps = {
  [key: string]: unknown;
  errorMessage?: string;
};

export default class ProfileInfo extends Service.Block {
  constructor(props: TProps = {}) {
    const state = store.getState();
    const user = (state.user || {}) as Partial<UserType>;

    const header = new Component.Header({});

    const avatarBlock = new Component.AvatarBlock({
      avatar: user.avatar
        ? `${BASE_URL}/resources/${user.avatar}`
        : 'https://sun9-10.userapi.com/impg/c857220/v857220791/1a63d2/s84IGNUrCIA.jpg?size=604x604&quality=96&sign=a34d795389b61c25532a3e630586b393&type=album',
      events: {
        click: () => {
          console.log('Avatar clicked');
        },
      },
    });

    const fieldsProps = [
      {
        label: 'Электронная почта',
        input: new Component.Input({
          type: 'email',
          name: 'email',
          value: user.email || '',
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
          value: user.login || '',
          attr: {
            'data-required': true,
            'data-valid-login': true,
          },
          events: {
            blur: (event: FocusEvent) => {
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
          value: user.first_name || '',
          attr: {
            'data-required': true,
            'data-valid-name': true,
          },
          events: {
            blur: (event: FocusEvent) => {
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
          value: user.second_name || '',
          attr: {
            'data-required': true,
            'data-valid-name': true,
          },
          events: {
            blur: (event: FocusEvent) => {
              Service.validate(event.target as HTMLInputElement);
            },
          },
        }),
      },
      {
        label: 'Отображаемое имя',
        input: new Component.Input({
          type: 'text',
          name: 'display_name',
          value: user.display_name || '',
          attr: {
            'data-required': true,
            'data-valid-name': true,
          },
          events: {
            blur: (event: FocusEvent) => {
              Service.validate(event.target as HTMLInputElement);
            },
          },
        }),
      },
      {
        label: 'Телефон',
        input: new Component.Input({
          type: 'tel',
          name: 'phone',
          value: user.phone || '',
          attr: {
            'data-required': true,
            'data-valid-phone': true,
          },
          events: {
            blur: (event: FocusEvent) => {
              Service.validate(event.target as HTMLInputElement);
            },
          },
        }),
      },
    ];

    const inputBlocks = fieldsProps.map((field) => new Component.InputBlock(field));

    const changePasswordLink = new Component.Link({
      text: 'Сменить пароль',
      className: 'profile-link',
      events: {
        click: () => {
          Service.router.go('/settings/edit-password');
        },
      },
    });

    const link = new Component.Link({
      text: 'Выйти',
      href: '/',
      className: 'profile-link',
      events: {
        click: () => {
          authController.logout();
        },
      },
    });

    const saveButton = new Component.Button({
      text: 'Сохранить изменения',
      attr: { withInternalID: true, type: 'submit' },
    });

    const backButton = new Component.Button({
      text: '← Назад',
      className: 'button-back',
      events: {
        click: () => {
          Service.router.go('/messenger');
        },
      },
    });

    const form = new Component.Form({
      inputBlocks,
      button: saveButton,
      events: {
        submit: (event: Event) => {
          event.preventDefault();
          if (Service.validateForm(event)) {
            const formData = getDataForm(event);
            if (
              typeof formData.email === 'string' &&
              typeof formData.login === 'string' &&
              typeof formData.first_name === 'string' &&
              typeof formData.second_name === 'string' &&
              typeof formData.display_name === 'string' &&
              typeof formData.phone === 'string'
            ) {
              // Создаем объект типа UserType
              const userProfile: UserType = {
                email: formData.email,
                login: formData.login,
                first_name: formData.first_name,
                second_name: formData.second_name,
                display_name: formData.display_name,
                phone: formData.phone,
              };
              userController.updateUserProfile(userProfile);
            } else {
              console.error(
                'Ошибка: одно из обязательных полей отсутствует или имеет неверный тип',
              );
            }
          }
        },
      },
    });

    const avatarInput = new Component.Input({
      type: 'file',
      name: 'avatar',
      attr: {
        accept: 'image/*',
      },
    });

    const uploadAvatarButton = new Component.Button({
      text: 'Загрузить аватар',
      attr: { withInternalID: true, type: 'submit' },
    });

    const avatarForm = new Component.Form({
      inputBlocks: [new Component.InputBlock({ label: 'Новый аватар', input: avatarInput })],
      button: uploadAvatarButton,
      events: {
        submit: (event: Event) => {
          event.preventDefault();
          const formElement = event.target as HTMLFormElement;
          const newAvatarData = new FormData(formElement);
          userController.updateAvatar(newAvatarData);
        },
      },
    });

    super({
      ...props,
      user,
      header,
      avatarBlock,
      changePasswordLink,
      title: 'Профиль пользователя',
      form,
      // Новая форма для загрузки аватара
      avatarForm,
      link,
      blockLinks: new Component.BlockLinks({}),
      backButton,
      errorMessage: props.errorMessage,
    });
  }

  render() {
    return this.compile(template, { ...this.props });
  }
}
