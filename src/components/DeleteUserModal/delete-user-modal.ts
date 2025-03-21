import { Block } from '../../services'
import { TProps } from '../../types'
import template from './template.hbs?raw'
import * as Component from '../index'
import * as Service from '../../services'
import { getDataForm, isEqual } from '../../utils'
import { chatController } from '../../controllers'
import { store } from '../../store'

export class RemoveUserModal extends Block<TProps> {
  constructor(props: TProps) {
    chatController.getUsersFromChat(props.selectedChatId)

    const removeUserButton = new Component.Button({
      text: 'Удалить выбранных',
      attr: { type: 'submit' }
    })

    const userInfoItems = new Component.Form({
      button: removeUserButton,
      inputBlocks: (store.getState().currentChatUsers || []).map((user) =>
          new Component.UserInfoItem({
            user,
            withCheckbox: true,
            attr: { name: 'userIds' }
          })
      ),
      events: {
        submit: (event: Event) => {
          event.preventDefault()
          const formData = getDataForm(event)
          const selectedChatId = this.props.selectedChatId
          const users = Object.keys(formData)
              .filter(key => formData[key] === 'on')
              .map(key => Number(key));


          if (users.length && selectedChatId) {
            chatController.removeUserFromChat(users, selectedChatId)
            this.setProps({ isOpen: false })
          }
        }
      }
    })

    super({
      ...props,
      userInfoItems,
      events: {
        click: (event: MouseEvent) => {
          const target = event.target as HTMLElement
          if (target.dataset.close === 'true' || target.classList.contains('modal-overlay')) {
            this.setProps({ isOpen: false })
          }
        }
      }
    })
  }

  override componentDidUpdate(oldProps: TProps, newProps: TProps): boolean {
    if (isEqual(oldProps, newProps)) return false

    const removeUserButton = new Component.Button({
      text: 'Удалить выбранных',
      attr: { type: 'submit' }
    })

    const updatedUserInfoItems = new Component.Form({
      button: removeUserButton,
      inputBlocks: (newProps.currentChatUsers || []).map((user) =>
          new Component.UserInfoItem({
            user,
            withCheckbox: true,
            attr: { name: 'userIds' }
          })
      ),
      events: {
        submit: (event: Event) => {
          event.preventDefault()
          const formData = getDataForm(event)
          const users = Object.keys(formData)
              .filter(key => formData[key] === 'on')
              .map(key => Number(key));
          const selectedChatId = this.props.selectedChatId
          console.log(event)
          console.log(formData)
          if (users.length && selectedChatId) {
            chatController.removeUserFromChat(users, selectedChatId)
            this.setProps({ isOpen: false })
          }
        }
      }
    })

    this.children.userInfoItems = updatedUserInfoItems
    return true
  }

  public render() {
    const { isOpen } = this.props
    const overlayClass = isOpen
        ? 'modal-overlay user-overlay'
        : 'modal-overlay user-overlay modal-closed'

    return this.compile(template, {
      ...this.props,
      overlayClass
    })
  }
}

function mapStateToProps(state: any): Partial<TProps> {
  return state
}

export default Service.connect(RemoveUserModal, mapStateToProps)