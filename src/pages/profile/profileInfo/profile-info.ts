import * as Component from '../../../components';
import * as Service from '../../../services';
import { TProps } from '../../../types';
import template from '../template.hbs?raw';

export default class ProfileInfo extends Service.Block {
  constructor(props: TProps) {
    const header = new Component.Header({});

    const avatarBlock = new Component.AvatarBlock({
      avatar:
        'https://sun9-10.userapi.com/impg/c857220/v857220791/1a63d2/s84IGNUrCIA.jpg?size=604x604&quality=96&sign=a34d795389b61c25532a3e630586b393&type=album',
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
          value: 'kvitoshnov@yandex.ru',
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
          value: 'KekOFF',
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
          value: 'Кирилл',
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
          value: 'Витошнов',
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
          value: 'Кирилл Витошнов',
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
          value: '+7 707 573-49-23',
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
      href: '/change-password',
      className: 'profile-link',
      events: {
        click: () => {
          console.log('link event Сменить пароль');
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

    const form = new Component.Form({
      inputBlocks,
      button: saveButton,
      events: {
        submit: (event: Event) => {
          Service.validateForm(event);
          if (Service.validateForm(event)) {
            console.log(Service.getDataForm(event));
          }
        },
      },
    });

    super({
      ...props,
      header,
      avatarBlock,
      changePasswordLink,
      title: 'Профиль пользователя',
      form,
      link,
      blockLinks: new Component.BlockLinks({}),
      backButton,
    });
  }

  render() {
    return this.compile(template, { ...this.props });
  }
}
