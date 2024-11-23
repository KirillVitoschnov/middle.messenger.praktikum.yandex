import * as Component from '../../../components';
import * as Service from '../../../services';
import { TProps } from '../../../types';
import template from '../template.hbs?raw';

export default class ErrorServer extends Service.Block {
  constructor(props: TProps) {
    const header = new Component.Header({});

    const link = new Component.Link({
      text: 'Назад к чатам',
      href: '/',
      events: {
        click: () => {
          console.log('event Назад к чатам');
        },
      },
    });

    super({
      ...props,
      Header: header,
      title: '500',
      info: 'Ошибка на стороне сервера',
      link: link,
      blockLinks: new Component.BlockLinks({}),
    });
  }

  render() {
    return this.compile(template, this.props);
  }
}
