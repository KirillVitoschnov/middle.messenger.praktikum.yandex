import { Block } from '../../services';
import { TProps } from '../../types';
import template from './template.hbs?raw';

export default class Messages extends Block {
  constructor(props: TProps) {
    super(props);
  }

  render() {
    return this.compile(template, { ...this.props });
  }
}
