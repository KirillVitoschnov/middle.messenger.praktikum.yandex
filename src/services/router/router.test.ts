import { expect } from 'chai';
import { JSDOM } from 'jsdom';

import Block, { PropsType } from '../block';
import { Router } from './router';

const dom = new JSDOM('<!DOCTYPE html><html><body><div id="app"></div></body></html>', {
    url: 'http://localhost:3000'
});

(global as any).window = dom.window;
(global as any).document = dom.window.document;
(global as any).History = dom.window.History;

class MockBlock extends Block<{}, {}, {}> {
    public hidden: boolean;

    constructor(props: PropsType = {}) {
        super(props);
        this.hidden = false;
    }

    hide() {
        this.hidden = true;
    }

    show() {
        this.hidden = false;
    }

    getContent(): HTMLElement {
        const el = document.createElement('div');
        el.textContent = 'MockBlock content';
        return el;
    }

    render(): DocumentFragment {
        const fragment = document.createDocumentFragment();
        fragment.appendChild(this.getContent());
        return fragment;
    }
}

describe('Класс Router', () => {
    let router: Router;

    beforeEach(() => {
        (Router as any).__instance = undefined;

        router = new Router('#app');
    });

    afterEach(() => {
        const appEl = document.querySelector('#app');
        if (appEl) {
            appEl.innerHTML = '';
        }
    });

    it('Должен создавать singleton (повторная инициализация возвращает тот же объект)', () => {
        const router2 = new Router('#another-root');
        expect(router2).to.equal(router);
    });

    describe('use()', () => {
        it('Добавляет маршрут в массив router.routes', () => {
            expect(router.routes).to.have.lengthOf(0);
            router.use('/test', MockBlock);
            expect(router.routes).to.have.lengthOf(1);

            const route = router.routes[0];
            expect((route as any)._pathname).to.equal('/test');
        });
    });

    describe('getRoute()', () => {
        it('Возвращает нужный Route при совпадении паттерна', () => {
            router.use('/home', MockBlock);
            router.use('/user/:id', MockBlock);

            const route = router.getRoute('/user/123');
            expect(route).not.to.be.undefined;
            expect((route as any)._pathname).to.equal('/user/:id');
        });

        it('Возвращает undefined, если маршрут не найден', () => {
            router.use('/home', MockBlock);
            const route = router.getRoute('/no-match');
            expect(route).to.be.undefined;
        });
    });

    describe('start()', () => {
        it('Ставит обработчик onpopstate и рендерит маршрут для текущего pathname', () => {
            router.use('/home', MockBlock);
            router.use('/user/:id', MockBlock);

            window.history.pushState({}, '', '/home');

            router.start();

            const currentRoute = (router as any)._currentRoute;
            expect(currentRoute).not.to.be.null;
            expect((currentRoute as any)._pathname).to.equal('/home');
        });
    });

    describe('go()', () => {
        it('Меняет history и рендерит нужный маршрут', () => {
            router.use('/test', MockBlock);
            router.start();

            router.go('/test');
            expect(window.location.pathname).to.equal('/test');

            const currentRoute = (router as any)._currentRoute;
            expect((currentRoute as any)._pathname).to.equal('/test');

            const appEl = document.querySelector('#app');
            expect(appEl?.innerHTML).to.contain('MockBlock content');
        });

        it('Не бросает ошибку, если роут не найден', () => {
            router.start();
            expect(() => router.go('/no-route')).to.not.throw();

            const currentRoute = (router as any)._currentRoute;
            expect(currentRoute).to.be.null;
        });
    });

    describe('back() и forward()', () => {
        beforeEach(() => {
            router.use('/', MockBlock);
            router.use('/page1', MockBlock);
            router.use('/page2', MockBlock);
            router.start();
        });

        it('back() возвращает на предыдущую страницу', () => {
            router.go('/page1');
            router.go('/page2');
            expect(window.location.pathname).to.equal('/page2');

            router.back();

            window.history.replaceState({}, '', '/page1');
            dom.window.dispatchEvent(new dom.window.PopStateEvent('popstate', { state: {} }));

            expect(window.location.pathname).to.equal('/page1');

            router.back();
            window.history.replaceState({}, '', '/');
            dom.window.dispatchEvent(new dom.window.PopStateEvent('popstate', { state: {} }));

            expect(window.location.pathname).to.equal('/');
        });

        it('forward() идёт вперёд по истории', () => {
            router.go('/page1');
            expect(window.location.pathname).to.equal('/page1');

            router.back();
            window.history.replaceState({}, '', '/');
            dom.window.dispatchEvent(new dom.window.PopStateEvent('popstate', { state: {} }));
            expect(window.location.pathname).to.equal('/');

            router.forward();
            window.history.replaceState({}, '', '/page1');
            dom.window.dispatchEvent(new dom.window.PopStateEvent('popstate', { state: {} }));
            expect(window.location.pathname).to.equal('/page1');
        });
    });
});
