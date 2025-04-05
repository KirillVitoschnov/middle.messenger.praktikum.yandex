import { expect } from 'chai';
import { set } from './set';

describe('Функция set', () => {
    it('должна установить значение по указанному пути в пустой объект', () => {
        const obj = {};
        const result = set(obj, 'a', 1);
        expect(result).to.deep.equal({ a: 1 });
    });

    it('должна добавить новое вложенное свойство, сохраняя существующие данные', () => {
        const obj = { a: { b: 2 } };
        const result = set(obj, 'a.c', 3);
        expect(result).to.deep.equal({ a: { b: 2, c: 3 } });
    });

    it('должна перезаписывать значение по указанному пути, если оно уже существует', () => {
        const obj = { a: { b: 2 } };
        const result = set(obj, 'a.b', 5);
        expect(result).to.deep.equal({ a: { b: 5 } });
    });

    it('должна корректно установить значение по длинному пути', () => {
        const obj = { a: { b: { d: 4 } } };
        const result = set(obj, 'a.b.c', 3);
        expect(result).to.deep.equal({ a: { b: { d: 4, c: 3 } } });
    });

    it('должна выбрасывать ошибку, если path не является строкой', () => {
        const obj = { a: 1 };
        // @ts-expect-error: намеренно передаем некорректный тип для path
        expect(() => set(obj, 123, 42)).to.throw('path must be string');
    });

    it('если переданный объект не является объектом, то функция должна вернуть его без изменений', () => {
        const num = 5;
        const result = set(num, 'a.b', 42);
        expect(result).to.equal(num);
    });

    it('должна корректно устанавливать значение в объект с несколькими уровнями вложенности', () => {
        const obj = { a: { b: { c: 3 } } };
        const result = set(obj, 'a.b.d', 4);
        expect(result).to.deep.equal({ a: { b: { c: 3, d: 4 } } });
    });
});
