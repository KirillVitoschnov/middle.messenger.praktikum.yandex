import { expect } from 'chai';
import { JSDOM } from 'jsdom';
import { getDataForm } from './getDataForm';

describe('Функция getDataForm', () => {
    let dom: JSDOM;
    let document: Document;

    beforeEach(() => {
        dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
        document = dom.window.document;

        (global as any).document = document;
        (global as any).window = dom.window;
        (global as any).HTMLElement = dom.window.HTMLElement;
        (global as any).HTMLInputElement = dom.window.HTMLInputElement;
        (global as any).HTMLSelectElement = dom.window.HTMLSelectElement;
        (global as any).HTMLTextAreaElement = dom.window.HTMLTextAreaElement;
    });

    it('должна корректно собирать данные из текстового input', () => {
        const form = document.createElement('form');
        form.innerHTML = `<input type="text" name="username" value="testUser" />`;
        const fakeEvent = { target: form } as unknown as Event;
        const data = getDataForm(fakeEvent);
        expect(data).to.have.property('username', 'testUser');
    });

    it('должна корректно обрабатывать checkbox input (отмечен)', () => {
        const form = document.createElement('form');
        form.innerHTML = `<input type="checkbox" name="subscribe" value="yes" checked />`;
        const fakeEvent = { target: form } as unknown as Event;
        const data = getDataForm(fakeEvent);
        expect(data).to.have.property('subscribe', 'yes');
    });

    it('должна корректно обрабатывать checkbox input (не отмечен)', () => {
        const form = document.createElement('form');
        form.innerHTML = `<input type="checkbox" name="subscribe" value="yes" />`;
        const fakeEvent = { target: form } as unknown as Event;
        const data = getDataForm(fakeEvent);
        expect(data).to.have.property('subscribe', false);
    });

    it('должна корректно обрабатывать select input', () => {
        const form = document.createElement('form');
        form.innerHTML = `
      <select name="country">
        <option value="ru" selected>Russia</option>
        <option value="us">USA</option>
      </select>`;
        const fakeEvent = { target: form } as unknown as Event;
        const data = getDataForm(fakeEvent);
        expect(data).to.have.property('country', 'ru');
    });

    it('должна корректно обрабатывать textarea input', () => {
        const form = document.createElement('form');
        form.innerHTML = `<textarea name="bio">Hello world!</textarea>`;
        const fakeEvent = { target: form } as unknown as Event;
        const data = getDataForm(fakeEvent);
        expect(data).to.have.property('bio', 'Hello world!');
    });

    it('должна корректно собирать данные из нескольких элементов формы', () => {
        const form = document.createElement('form');
        form.innerHTML = `
      <input type="text" name="username" value="testUser" />
      <input type="checkbox" name="subscribe" value="yes" checked />
      <select name="country">
        <option value="ru" selected>Russia</option>
        <option value="us">USA</option>
      </select>
      <textarea name="bio">Hello world!</textarea>
    `;
        const fakeEvent = { target: form } as unknown as Event;
        const data = getDataForm(fakeEvent);
        expect(data).to.deep.equal({
            username: 'testUser',
            subscribe: 'yes',
            country: 'ru',
            bio: 'Hello world!'
        });
    });
});
