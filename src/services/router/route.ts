import Block, { PropsType } from '../block';
import { RouteProps } from '../../types';
import { store } from '../../store';

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
      store.setState('errorMessage', '');
    }
  }

  match(pathname: string): boolean {
    const routePattern = this._pathname.replace(/:([a-zA-Z]+)/g, '([^/]+)');
    const regExp = new RegExp(`^${routePattern}$`);
    return regExp.test(pathname);
  }

  getParams(pathname: string): Record<string, string> {
    const paramNames = [...this._pathname.matchAll(/:([a-zA-Z]+)/g)].map((match) => match[1]);
    const routePattern = this._pathname.replace(/:([a-zA-Z]+)/g, '([^/]+)');
    const regExp = new RegExp(`^${routePattern}$`);
    const matches = pathname.match(regExp);

    if (!matches) {
      return null;
    }

    return paramNames.reduce<Record<string, string>>((params, paramName, index) => {
      params[paramName] = matches[index + 1];
      return params;
    }, {});
  }

  private _renderDom(query: string, block: Block) {
    const root = document.querySelector(query);
    if (root) {
      root.innerHTML = ''; // Очищаем предыдущий контент
      root.append(block.getContent()!);
    }
  }

  render() {
    const params = this.getParams(window.location.pathname);

    if (!this._block || params) {
      this._block = new this._blockClass({ ...params });
      this._renderDom(this._props.rootQuery, this._block);
      return;
    }
    this._block.show();
  }
}
