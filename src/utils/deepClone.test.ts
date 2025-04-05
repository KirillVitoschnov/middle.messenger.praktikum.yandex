import { expect } from 'chai';
import { deepClone } from './deepClone';

describe('Функция deepClone', () => {
    it('должна возвращать примитив для примитивов', () => {
        expect(deepClone(10)).to.equal(10);
        expect(deepClone("строка")).to.equal("строка");
        expect(deepClone(true)).to.equal(true);
        expect(deepClone(null)).to.equal(null);
        expect(deepClone(undefined)).to.equal(undefined);
    });

    it('должна корректно клонировать массивы примитивов', () => {
        const arr = [1, 2, 3, 4];
        const clonedArr = deepClone(arr);
        expect(clonedArr).to.deep.equal(arr);
        expect(clonedArr).to.not.equal(arr);
    });

    it('должна корректно клонировать массивы объектов', () => {
        const arr = [{ a: 1 }, { b: 2 }];
        const clonedArr = deepClone(arr);
        expect(clonedArr).to.deep.equal(arr);
        expect(clonedArr).to.not.equal(arr);
        expect(clonedArr[0]).to.not.equal(arr[0]);
    });

    it('должна корректно клонировать объекты с примитивами', () => {
        const obj = { a: 1, b: "тест", c: true };
        const clonedObj = deepClone(obj);
        expect(clonedObj).to.deep.equal(obj);
        expect(clonedObj).to.not.equal(obj);
    });

    it('должна глубоко клонировать вложенные объекты', () => {
        const obj = {
            a: 1,
            b: {
                c: 2,
                d: {
                    e: 3,
                },
            },
        };
        const clonedObj = deepClone(obj);
        expect(clonedObj).to.deep.equal(obj);
        expect(clonedObj).to.not.equal(obj);
        expect(clonedObj.b).to.not.equal(obj.b);
        expect(clonedObj.b.d).to.not.equal(obj.b.d);
    });

    it('должна корректно клонировать пустые объекты и массивы', () => {
        expect(deepClone({})).to.deep.equal({});
        expect(deepClone([])).to.deep.equal([]);
    });

    it('должна корректно клонировать объекты с массивами', () => {
        const obj = {
            a: [1, 2, { b: 3 }],
            c: "hello",
        };
        const clonedObj = deepClone(obj);
        expect(clonedObj).to.deep.equal(obj);
        expect(clonedObj.a).to.not.equal(obj.a);
        expect(clonedObj.a[2]).to.not.equal(obj.a[2]);
    });

    it('должна возвращать ту же функцию, если передана функция', () => {
        const func = () => 42;
        const clonedFunc = deepClone(func);
        expect(clonedFunc).to.equal(func);
    });
});
