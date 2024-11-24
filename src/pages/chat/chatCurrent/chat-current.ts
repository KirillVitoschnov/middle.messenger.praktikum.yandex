import * as Component from '../../../components';
import * as Service from '../../../services';
import { TProps } from '../../../types';
import template from '../template.hbs?raw';

export default class ChatCurrent extends Service.Block {
  constructor(props: TProps) {
    const chatLeftSideBar = new Component.ChatLeftSideBar({});
    const chatUserTop = new Component.ChatUserTop({
      userName: 'Alex',
    });

    const chatterBlock = new Component.ChatterBlock({});
    const chatForm = new Component.ChatForm({
      events: {
        submit: (event: Event) => {
          Service.validateForm(event);
          if (Service.validateForm(event)) {
            Service.getDataForm(event);
          }
        },
      },
    });

    super({
      ...props,
      leftSideBar: chatLeftSideBar,
      topContainer: chatUserTop,
      bodyContainer: chatterBlock,
      footerContainer: chatForm,
      blockLinks: new Component.BlockLinks({}),
    });
  }

  render() {
    return this.compile(template, { ...this.props });
  }
}
