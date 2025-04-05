import { expect } from 'chai';
import { JSDOM } from 'jsdom';
import { render } from './render';
import { Renderable } from '../types';

class DummyBlock implements Renderable {
  public content: Element;
  public componentDidMountCalled: boolean = false;

  constructor() {
    this.content = document.createElement('div');
    this.content.textContent = 'dummy content';
  }

  getContent(): Element {
    return this.content;
  }

  dispatchComponentDidMount(): void {
    this.componentDidMountCalled = true;
  }
}

describe('Функция render', () => {
  let dom: JSDOM;
  let document: Document;

  beforeEach(() => {
    dom = new JSDOM('<!DOCTYPE html><html><body><div id="app"></div></body></html>');
    document = dom.window.document;
    (global as any).document = document;
    (global as any).window = dom.window;
  });

  it('должна найти корневой элемент по селектору, добавить контент блока и вызвать dispatchComponentDidMount', () => {
    const dummyBlock = new DummyBlock();
    const root = render('#app', dummyBlock);

    expect(root).to.not.be.null;
    expect(root?.innerHTML).to.contain('dummy content');
    expect(dummyBlock.componentDidMountCalled).to.be.true;
  });

  it('должна вернуть null, если элемент по селектору не найден', () => {
    const dummyBlock = new DummyBlock();
    const result = render('#non-existent', dummyBlock);
    expect(result).to.be.null;
  });
});
