import { assert } from 'chai';
import Block from './block';

class TestBlock extends Block {
    render(): DocumentFragment {
        const template = `<div class="test-block">{{text}}</div>`;
        return this.compile(template, { ...this.props });
    }
    componentDidMount() {
        (this.props as any).componentMounted = true;
    }
}

describe('Block', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    it('создает элемент и рендерит шаблон', () => {
        const block = new TestBlock({ text: 'Привет', withInternalId: true });
        const content = block.getContent();
        assert.exists(content);
        assert.equal(content!.outerHTML, `<div class="test-block" data-id="${block.id}">Привет</div>`);
    });

    it('обновляет пропсы и перерисовывает компонент', () => {
        const block = new TestBlock({ text: 'Первый', withInternalId: true });
        const content1 = block.getContent();
        assert.exists(content1);
        block.setProps({ text: 'Второй' });
        const content2 = block.getContent();
        assert.exists(content2);
        assert.notEqual(content1!.outerHTML, content2!.outerHTML);
        assert.include(content2!.outerHTML, 'Второй');
    });

    it('вызывает componentDidMount', () => {
        const block = new TestBlock({ text: 'Привет' });
        block.getContent();
        assert.isTrue((block.props as any).componentMounted);
    });

    it('корректно компилирует шаблон без детей', () => {
        const block = new TestBlock({ text: 'Текст' });
        const fragment = block.compile('<div>{{text}}</div>', block.props);
        const container = document.createElement('div');
        container.appendChild(fragment);
        assert.equal(container.innerHTML, '<div>Текст</div>');
    });

    it('добавляет атрибуты из props', () => {
        const block = new TestBlock({ text: 'Атрибут', attr: { title: 'Заголовок' }, withInternalId: true });
        block.getContent();
        assert.exists(block.element);
        assert.equal(block.element!.getAttribute('title'), 'Заголовок');
        assert.equal(block.element!.getAttribute('data-id'), block.id);
    });

    it('обрабатывает события', (done) => {
        const handler = () => { done(); };
        const block = new TestBlock({ text: 'Кликни', events: { click: handler } });
        const content = block.getContent();
        assert.exists(content);
        content!.click();
    });

    it('отображает и скрывает элемент', () => {
        const app = document.createElement('div');
        app.id = 'app';
        document.body.appendChild(app);
        const block = new TestBlock({ text: 'Контент' });
        block.show();
        const content = block.getContent();
        assert.exists(content);
        assert.isTrue(app.contains(content!));
        block.hide();
        assert.isFalse(app.contains(block.getContent()!));
    });
});
