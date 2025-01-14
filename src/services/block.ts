import EventBus from './eventBus';
import Handlebars from 'handlebars';
import { v4 as makeUUID } from 'uuid';
import { EventType, ObjectType } from '../types';
import { isEqual } from '../utils';

export type PropsType = {
  events?: EventType;
  className?: string | string[] | Node[];
  [key: string]: Block<PropsType> | Block<PropsType>[] | string | unknown;
};

type PropsChildrenType = {
  [key: string]: Block<PropsType>;
};

type PropsListsType = {
  [key: string]: Block<PropsType> | string[];
};

type PropsTypeOrEmptyObject = Partial<PropsType> & {};
export default abstract class Block<
  Props extends Partial<PropsType> = {},
  Children extends Partial<PropsChildrenType> = {},
  Lists extends Partial<PropsListsType> = {},
> {
  static EVENTS = {
    INIT: 'init',
    FLOW_CDM: 'flow:component-did-mount',
    FLOW_RENDER: 'flow:render',
    FLOW_CDU: 'flow:component-did-update',
  };
  _element: HTMLElement | null = null;

  id: string = '';
  props: Props;
  children: Children;
  lists: Lists;
  eventBus: () => EventBus<unknown>;

  constructor(propsAndChildren?: Props & Children & Lists) {
    const { children, props, lists } = this._getChildrenAndList(propsAndChildren!);
    this.children = children;
    this.lists = lists;
    const eventBus = new EventBus();

    this.id = makeUUID();
    //@ts-ignore
    this.props = this._makePropsProxy({ ...props, id: this.id } as Props);
    this.eventBus = () => eventBus;
    this._registerEvents(eventBus);
    eventBus.emit(Block.EVENTS.INIT);
  }
  _registerEvents(eventBus: EventBus<unknown>) {
    eventBus.on(Block.EVENTS.INIT, this._init.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
    eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
    //@ts-ignore
    eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
  }

  _getChildrenAndList(propsAndChildren: Props & Children & Lists) {
    const children: {} & Partial<PropsChildrenType> = {};
    const props: {} & Partial<PropsType> = {};
    const lists: {} & Partial<PropsListsType> = {};

    Object.entries(propsAndChildren as PropsTypeOrEmptyObject).forEach(([key, value]) => {
      if (value instanceof Block) {
        children[key] = value;
      } else if (Array.isArray(value)) {
        lists[key] = value;
      } else {
        props[key] = value;
      }
    });

    return {
      children: children as Children,
      props: props as PropsTypeOrEmptyObject,
      lists: lists as Lists,
    };
  }

  get element() {
    return this._element;
  }

  public _init() {
    this.init();

    this._createResources();
    this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
  }

  init(): void | null {}

  private _createResources() {
    this._element = this._createDocumentElement('div');
  }

  private _createDocumentElement(tagName: string) {
    const element = document.createElement(tagName);
    return element;
  }

  public render(): DocumentFragment {
    return this.render();
  }

  private _render(): void {
    this._removeEvents();
    if (this._element) {
      this._element.innerHTML = '';
    }

    const renderResult = this.render();
    const firstElement = renderResult.firstElementChild as HTMLElement;
    if (firstElement) {
      this._element?.replaceWith(firstElement);
      this._element = firstElement;
    }

    this._addEvents();
    this._addAttributes();
  }

  public componentDidMount() {}

  public getContent() {
    this.dispatchComponentDidMount();

    return this.element;
  }

  public dispatchComponentDidMount() {
    this.eventBus().emit(Block.EVENTS.FLOW_CDM);
  }

  private _componentDidMount() {
    this.componentDidMount();

    Object.values(this.children).forEach((child) => {
      const blockChild = child as Block;
      blockChild.dispatchComponentDidMount();
    });
  }

  private _componentDidUpdate(oldProps: PropsType, newProps: PropsType): void {
    if (!oldProps && !newProps){
      return;
    }
    const response = this.componentDidUpdate(oldProps, newProps);
    console.log('response', response);
    if (!response) {
      return;
    }

    this._render();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  componentDidUpdate(oldProps: PropsType, newProps: PropsType) {
    console.log('o', oldProps, 'n', newProps);
    console.log(!isEqual(oldProps, newProps))
    return !isEqual(oldProps, newProps);
  }



  public setProps = (nextProps: Node) => {
    console.log('nextProps: ', nextProps, 'this.props', this.props);
    if (!nextProps) {
      return;
    }

    Object.assign(this.props, nextProps);
    this.eventBus().emit(Block.EVENTS.FLOW_CDU);
  };

  compile(template: string, props: PropsType): DocumentFragment {
    const propsAndStubs: PropsType = { ...props };

    Object.entries(this.children).forEach(([key, child]) => {
      const blockChild = child as Block;
      propsAndStubs[key] = `<div data-id="${blockChild.id}"></div>`;
    });

    Object.entries(this.lists).forEach(([key, list]) => {
      const blockList = list;
      if (Array.isArray(blockList)) {
        //@ts-ignore
        propsAndStubs[key] = `<div data-id="${blockList?.map((item) => item.id).join(',')}"></div>`;
      }
    });

    const compiledTemplate = Handlebars.compile(template);
    const fragment = document.createElement('template');

    fragment.innerHTML = compiledTemplate(propsAndStubs);

    Object.values(this.children).forEach((child) => {
      const blockChild = child as Block;
      const stub = fragment.content.querySelector(`[data-id="${blockChild.id}"]`);
      if (stub) {
        stub.replaceWith(blockChild.getContent() as Node);
      }
    });

    Object.entries(this.lists).forEach(([, list]) => {
      const blockList = list;
      const listContent = this._createDocumentElement('template') as HTMLTemplateElement;
      if (Array.isArray(blockList)) {
        blockList.forEach((item) => {
          if ((item as unknown as Block<PropsType>) instanceof Block) {
            listContent.content.append((item as unknown as Block<PropsType>).getContent() as Node);
          } else {
            listContent.content.append(document.createTextNode(item));
          }
        });

        const stub = fragment.content.querySelector(
          `[data-id="${blockList.map((item: unknown) => (item as unknown as Block<PropsType>).id!).join(',')}"]`,
        );

        if (stub) {
          stub.replaceWith(listContent.content);
        }
      }
    });

    return fragment.content;
  }

  private _addAttributes() {
    const { attr = {} } = this.props;

    if (this.props.withInternalId) {
      this._element?.setAttribute('data-id', this.id);
    }

    Object.entries(attr as ObjectType).forEach(([key, value]) => {
      if (this._element) {
        this._element.setAttribute(key, value as string);
      }
    });
  }

  private _addEvents() {
    const { events = {} } = this.props;

    Object.keys(events as EventType).forEach((eventName) => {
      this._element?.addEventListener(eventName, (events as EventType)[eventName], true);
    });
  }

  private _removeEvents() {
    const { events = {} } = this.props;
    Object.keys(events as EventType).forEach((eventName) => {
      this._element?.removeEventListener(eventName, (events as EventType)[eventName]);
    });
  }

  private _makePropsProxy(props: Props) {
    const self = this;
    const proxyProps = new Proxy(props, {
      get(target: Props, prop: string) {
        // if (prop.startsWith('_')) {
        //   throw new Error('Нет прав');
        // }

        const value = target[prop];
        return typeof value === 'function' ? value.bind(target) : value;
      },

      set(target: PropsTypeOrEmptyObject, prop: string, value) {
        // if (prop.startsWith('_') || !value) {
        //   throw new Error('Нет прав');
        // }

        const oldProps = { ...target };
        target[prop] = value;
        self.eventBus().emit(Block.EVENTS.FLOW_CDU, oldProps, target);

        return true;
      },

      deleteProperty() {
        throw new Error('Нет прав');
      },
    });

    return proxyProps;
  }

  public show(): void {
    const content = this.getContent();
    if (content) {
      document.getElementById('app')!.appendChild(content);
    }
  }

  public hide(): void {
    const content = this.getContent();
    if (content) {
      content.remove();
    }
  }
}
