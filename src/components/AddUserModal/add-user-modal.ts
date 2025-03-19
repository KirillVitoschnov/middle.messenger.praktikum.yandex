import { Block } from '../../services'
import { TProps } from '../../types'
import template from './template.hbs?raw'
import * as Component from '../index'
import * as Service from '../../services'
import { getDataForm, isEqual } from '../../utils'
import { userController, chatController } from '../../controllers'
import { store } from '../../store'

export class AddUserModal extends Block<TProps> {
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
            'data-valid-login': true
          },
          events: {
            blur: (event: FocusEvent) => {
              Service.validate(event.target as HTMLInputElement)
            }
          }
        })
      }
    ]
    const inputBlocks = fieldsProps.map((field) => new Component.InputBlock(field))
    const saveButton = new Component.Button({
      text: 'Поиск пользователя',
      attr: { withInternalID: true, type: 'submit' }
    })
    const form = new Component.Form({
      inputBlocks,
      button: saveButton,
      events: {
        submit: async (event: Event) => {
          event.preventDefault()
          const formData = getDataForm(event)
          if (typeof formData.login === 'string') {
            try {
              await userController.searchUser(formData.login)
            } catch {}
          }
        }
      }
    })
    const addUserButton = store.getState().users?.length
        ? new Component.Button({
          text: 'Добавить пользователя',
          attr: { withInternalID: true, type: 'button' },
          events: {
            click: () => {
              const { users } = store.getState()
              const selectedChatId = this.props.selectedChatId
              if (selectedChatId && users?.length) {
                const userIds = users.map((u: any) => u.id)
                chatController.addUserToChat(userIds, selectedChatId)
                this.setProps({ isOpen: false })
                store.setState('users', [])
              }
            }
          }
        })
        : null
    const userInfoItems = new Component.Form({
      button: addUserButton,
      inputBlocks: (store.getState().users || []).map((user) =>
          new Component.UserInfoItem({
            user,
            events: {
              click: () => {}
            }
          })
      )
    })
    super({
      ...props,
      form,
      userInfoItems,
      events: {
        click: (event: MouseEvent) => {
          const target = event.target as HTMLElement
          if (target.dataset.close === 'true' || target.classList.contains('modal-overlay')) {
            this.setProps({ isOpen: false })
            store.setState('users', [])
          }
        }
      }
    })
  }
  override componentDidUpdate(oldProps: TProps, newProps: TProps): boolean {
    if (isEqual(oldProps, newProps)) {
      return false
    }
    const state = store.getState()
    const addUserButton = state.users?.length
        ? new Component.Button({
          text: 'Добавить пользователя',
          attr: { withInternalID: true, type: 'button' },
          events: {
            click: () => {
              const { users } = store.getState()
              const selectedChatId = this.props.selectedChatId
              if (selectedChatId && users?.length) {
                const userIds = users.map((u: any) => u.id)
                chatController.addUserToChat(userIds, selectedChatId)
                this.setProps({ isOpen: false })
                store.setState('users', [])
              }
            }
          }
        })
        : null
    const updatedUserInfoItems = new Component.Form({
      inputBlocks: (state.users || []).map((user) =>
          new Component.UserInfoItem({
            user,
            events: {
              click: () => {}
            }
          })
      ),
      button: addUserButton
    })
    this.children.userInfoItems = updatedUserInfoItems
    return true
  }
  public render() {
    const { isOpen } = this.props
    const overlayClass = isOpen
        ? 'modal-overlay add-user-overlay'
        : 'modal-overlay add-user-overlay modal-closed'
    return this.compile(template, {
      ...this.props,
      overlayClass
    })
  }
}

function mapStateToProps(state: any): Partial<TProps> {
  return state
}

export default Service.connect(AddUserModal, mapStateToProps)
