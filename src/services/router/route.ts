import { RouteProps } from '../../types';
import { getEqual } from '../../utils';
import Block, { PropsType } from '../block';

export class Route {
  private _pathname: string;
  private _blockClass: new (props?: PropsType) => Block;
  private _block: Block | null;
  private _props: RouteProps;

  constructor(pathname: string, view: new (props?: PropsType) => Block, props: RouteProps) {
    this._pathname = pathname;
    this._blockClass = view;
    this._block = null;
    this._props = props;
  }

  navigate(pathname: string) {
    if (this.match(pathname)) {
      this._pathname = pathname;
      this.render();
    }
  }

  leave() {
    if (this._block) {
      this._block.hide();
    }
  }

  match(pathname: string): boolean {
    return getEqual(pathname, this._pathname);
  }

  _renderDom(query: string, block: Block) {
    const root = document.querySelector(query);
    if (root) {
      root.append(block.getContent()!);
    }
  }

  render() {
    if (!this._block) {
      this._block = new this._blockClass();
      this._renderDom(this._props.rootQuery, this._block);
      return;
    }

    this._block.show();
  }
}
