import { Block } from '../../services';
import { TProps } from '../../types';
import template from './template.hbs?raw';
import * as Component from '../index';
import * as Service from '../../services';
import {  getDataForm, isEqual } from '../../utils';
import {  userController } from '../../controllers';
import { store } from '../../store';

export default class AddUserModal extends Block<TProps> {
  private currentUsers = [];

  constructor(props: TProps) {
    const fieldsProps = [
      {
        label: 'Логин',
        input: new Component.Input({
          type: 'text',
          name: 'login',
          value: '',
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
    ];

    const inputBlocks = fieldsProps.map((field) => new Component.InputBlock(field));

    const saveButton = new Component.Button({
      text: 'Поиск пользователя',
      attr: { withInternalID: true, type: 'submit' },
    });

    const form = new Component.Form({
      inputBlocks,
      button: saveButton,
      events: {
        submit: async (event: Event) => {
          event.preventDefault();
          const formData = getDataForm(event);
          if (typeof formData.login === 'string') {
            try {
              await userController.searchUser(formData.login);
            } catch (error) {
              console.error('Ошибка при поиске пользователя:', error);
            }
          } else {
            console.error('Ошибка: логин не является строкой');
          }
        },
      },
    });


    const state = store.getState();
    console.log(state.users)
    const userInfoItems = new Component.UserInfoItems({
      items: (state.users || []).map((user) =>
          new Component.UserInfoItem({
            user:user
          })
      ),
    });
console.log(userInfoItems)
    super({
      ...props,
      form,
      userInfoItems,
      events: {
        click: (event: MouseEvent) => {
          const target = event.target as HTMLElement;
          if (
              target.dataset.close === 'true' ||
              target.classList.contains('modal-overlay')
          ) {
            this.setProps({ isOpen: false });
          }
        },
      },
    });
    this.currentUsers = state.users || [];
  }
  override componentDidUpdate(oldProps: TProps, newProps: TProps): boolean {
    console.log(oldProps, newProps);
    if (isEqual(oldProps, newProps)) return false
    return true
  }

  public render() {
    const { isOpen } = this.props;
    const overlayClass = isOpen
        ? 'modal-overlay add-user-overlay'
        : 'modal-overlay add-user-overlay modal-closed';

    return this.compile(template, {
      ...this.props,
      overlayClass,
    });
  }
}
