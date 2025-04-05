import { expect } from 'chai';
import { JSDOM } from 'jsdom';
import { Route } from './route';

const dom = new JSDOM('<!DOCTYPE html><html><body><div id="app"></div></body></html>', {
  url: 'http://localhost:3000', // <-- ключевой момент
});
(global as any).window = dom.window;
(global as any).document = dom.window.document;

class MockBlock {
  public props: Record<string, unknown>;
  public hidden: boolean;

  constructor(props?: Record<string, unknown>) {
    this.props = props || {};
    this.hidden = false;
  }

  public hide(): void {
    this.hidden = true;
  }

  public show(): void {
    this.hidden = false;
  }

  public getContent(): HTMLElement {
    const div = document.createElement('div');
    div.innerHTML = 'MockBlock content';
    return div;
  }
}

export const store = {
  errorMessage: '',
  setState(key: string, value: string) {
    if (key === 'errorMessage') {
      this.errorMessage = value;
    }
  },
};

describe('Класс Route', () => {
  let route: Route;

  beforeEach(() => {
    store.errorMessage = '';

    route = new Route('/user/:id', MockBlock as any, { rootQuery: '#app' });
  });

  afterEach(() => {
    const appEl = document.querySelector('#app');
    if (appEl) {
      appEl.innerHTML = '';
    }
  });

  it('Должен корректно создаваться и сохранять pathname', () => {
    expect((route as any)._pathname).to.equal('/user/:id');
  });

  describe('Метод match()', () => {
    it('Возвращает true, если путь соответствует шаблону', () => {
      expect(route.match('/user/123')).to.be.true;
    });

    it('Возвращает false, если путь не соответствует шаблону', () => {
      expect(route.match('/user')).to.be.false;
      expect(route.match('/user/123/edit')).to.be.false;
      expect(route.match('/something/else')).to.be.false;
    });
  });

  describe('Метод getParams()', () => {
    it('Возвращает объект с параметрами при совпадении', () => {
      const params = route.getParams('/user/123');
      expect(params).to.deep.equal({ id: '123' });
    });

    it('Возвращает null, если путь не совпадает', () => {
      const params = route.getParams('/user');
      expect(params).to.be.null;
    });

    it('Корректно парсит несколько параметров', () => {
      const multiParamRoute = new Route('/post/:postId/comment/:commentId', MockBlock as any, {
        rootQuery: '#app',
      });
      const params = multiParamRoute.getParams('/post/10/comment/200');
      expect(params).to.deep.equal({ postId: '10', commentId: '200' });
    });
  });

  describe('Метод navigate()', () => {
    it('Должен вызвать render() (создать блок) при успешном match()', () => {
      route.navigate('/user/123');
      const currentBlock = (route as any)._block;
      expect(currentBlock).not.to.be.null;
      const appEl = document.querySelector('#app');
      expect(appEl?.innerHTML).to.contain('MockBlock content');
    });

    it('Не должен рендерить при неудавшемся match()', () => {
      route.navigate('/wrong/path');
      expect((route as any)._block).to.be.null;
      const appEl = document.querySelector('#app');
      expect(appEl?.innerHTML).to.equal('');
    });
  });

  describe('Метод leave()', () => {
    it('Должен вызвать hide() у блока и очистить store.errorMessage', () => {
      route.render();
      expect(store.errorMessage).to.equal('');
      route.leave();
      expect(store.errorMessage).to.equal('');
      const currentBlock = (route as any)._block as MockBlock;
      expect(currentBlock.hidden).to.be.true;
    });

    it('Не кидает исключение, если блок ещё не создан (null)', () => {
      expect(() => route.leave()).to.not.throw();
    });
  });

  describe('Метод render()', () => {
    it('Создаёт новый блок при первом вызове и добавляет его в DOM', () => {
      expect((route as any)._block).to.be.null;
      route.render();
      const currentBlock = (route as any)._block;
      expect(currentBlock).to.be.an.instanceOf(MockBlock);
      const appEl = document.querySelector('#app');
      expect(appEl?.innerHTML).to.contain('MockBlock content');
    });

    it('При повторном вызове (с теми же параметрами) повторно блок не создаёт, а только показывает', () => {
      route.render();
      const oldBlock = (route as any)._block as MockBlock;
      expect(oldBlock.hidden).to.be.false;
      route.render();
      const newBlock = (route as any)._block as MockBlock;
      expect(newBlock).to.equal(oldBlock);
      // Проверим, что он (newBlock) не ушёл в hidden
      expect(newBlock.hidden).to.be.false;
    });

    it('При смене параметров должен создавать новый блок', () => {
      (global as any).window.history.pushState({}, '', '/user/123');
      route.render();
      const oldBlock = (route as any)._block as MockBlock;
      expect(oldBlock.props).to.deep.equal({ id: '123' });

      (global as any).window.history.pushState({}, '', '/user/456');
      route.render();
      const newBlock = (route as any)._block as MockBlock;
      expect(newBlock).not.to.equal(oldBlock);
      expect(newBlock.props).to.deep.equal({ id: '456' });
    });
  });
});
