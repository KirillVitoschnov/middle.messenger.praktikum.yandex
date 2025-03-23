import { Block } from '../../services';
import { AddUserModalProps, StoreType, Indexed } from '../../types';
import template from './template.hbs?raw';
import * as Component from '../index';
import * as Service from '../../services';
import { getDataForm, isEqual } from '../../utils';
import { userController, chatController } from '../../controllers';
import { store } from '../../store';

type AddUserModalChildren = {
  form: InstanceType<typeof Component.Form>;
  userInfoItems: InstanceType<typeof Component.Form> | null;
};

export class AddUserModal extends Block<AddUserModalProps> {
  constructor(props: AddUserModalProps = {} as AddUserModalProps) {
    const fieldsProps = [
      {
        label: 'Логин',
        input: new Component.Input({
          type: 'text',
          name: 'login',
          value: '',
          attr: {
            'data-required': true,
            'data-valid-login': true
          },
          events: {
            blur: (event: FocusEvent) => {
              Service.validate(event.target as HTMLInputElement);
            }
          }
        })
      }
    ];
    const inputBlocks = fieldsProps.map((field) => new Component.InputBlock(field));
    const saveButton = new Component.Button({
      text: 'Поиск пользователя',
      attr: { withInternalID: true, type: 'submit' }
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
            } catch {}
          }
        }
      }
    });
    const addUserButton = store.getState().users?.length
        ? new Component.Button({
          text: 'Добавить пользователя',
          attr: { withInternalID: true, type: 'submit' },
          events: {}
        })
        : null;
    const userInfoItems = new Component.Form({
      events: {
        submit: (event: Event) => {
          event.preventDefault();
          const formData = getDataForm(event);
          const users = Object.keys(formData)
              .filter((key) => formData[key] === 'on')
              .map((key) => Number(key));
          const selectedChatId = props.selectedChatId;
          if (selectedChatId && users?.length) {
            chatController.addUserToChat(users, selectedChatId);
            this.setProps({ isOpen: false });
            store.setState('users', []);
          }
        }
      },
      button: addUserButton,
      inputBlocks: (store.getState().users || []).map(
          (user) =>
              new Component.UserInfoItem({
                user,
                events: {
                  click: () => {}
                }
              })
      )
    });
    super({
      ...props,
      form,
      userInfoItems,
      events: {
        click: (event: MouseEvent) => {
          const target = event.target as HTMLElement;
          if (target.dataset.close === 'true' || target.classList.contains('modal-overlay')) {
            this.setProps({ isOpen: false });
            store.setState('users', []);
          }
        }
      }
    });
  }

  override componentDidUpdate(oldProps: AddUserModalProps, newProps: AddUserModalProps): boolean {
    if (isEqual(oldProps, newProps)) {
      return false;
    }
    const state = store.getState();
    const addUserButton = state.users?.length
        ? new Component.Button({
          text: 'Добавить пользователя',
          attr: { withInternalID: true, type: 'submit' },
          events: {}
        })
        : null;
    const updatedUserInfoItems = new Component.Form({
      events: {
        submit: (event: Event) => {
          event.preventDefault();
          const formData = getDataForm(event);
          const users = Object.keys(formData)
              .filter((key) => formData[key] === 'on')
              .map((key) => Number(key));
          const selectedChatId = this.props.selectedChatId;
          if (selectedChatId && users?.length) {
            chatController.addUserToChat(users, selectedChatId);
            this.setProps({ isOpen: false });
            store.setState('users', []);
          }
        }
      },
      inputBlocks: (state.users || []).map(
          (user) =>
              new Component.UserInfoItem({
                user,
                events: {
                  click: () => {}
                }
              })
      ),
      button: addUserButton
    });
    (this.children as AddUserModalChildren).userInfoItems = updatedUserInfoItems;
    return true;
  }

  public render() {
    const { isOpen } = this.props;
    const overlayClass = isOpen
        ? 'modal-overlay user-overlay'
        : 'modal-overlay user-overlay modal-closed';
    return this.compile(template, {
      ...this.props,
      overlayClass
    });
  }
}

function mapStateToProps(state: Indexed): Partial<AddUserModalProps> {
  return state as StoreType;
}

export default Service.connect(AddUserModal, mapStateToProps);
