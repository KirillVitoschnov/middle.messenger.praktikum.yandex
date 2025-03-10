import { Block } from '../../services'
import { TProps } from '../../types'
import template from './template.hbs?raw'
import { chatController } from '../../controllers'

export default class DeleteUserModal extends Block {
  constructor(props: TProps) {
    super({
      ...props,
      events: {
        click: (event: MouseEvent) => {
          const target = event.target as HTMLElement
          if (target.dataset.close === 'true' || target.classList.contains('modal-overlay')) {
            this.setProps({ isOpen: false })
          }
        },
        submit: (event: Event) => {
          event.preventDefault()
          const formData = new FormData(event.target as HTMLFormElement)
          const userId = formData.get('userId')
          if (userId) {
            if (this.props.chatId) {
              chatController.addUserToChat(this.props.chatId, Number(userId))
            }
            this.setProps({ isOpen: false })
          }
        }
      }
    })
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
