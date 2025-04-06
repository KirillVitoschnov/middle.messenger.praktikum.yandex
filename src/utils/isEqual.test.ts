import { expect } from 'chai';
import { isEqual } from './isEqual';

describe('Функция isEqual', () => {
  it('должна возвращать true для одинаковых примитивов (числа)', () => {
    expect(isEqual(5, 5)).to.be.true;
  });

  it('должна возвращать true для одинаковых примитивов (строки)', () => {
    expect(isEqual('hello', 'hello')).to.be.true;
  });

  it('должна возвращать false для разных примитивов', () => {
    expect(isEqual(5, 10)).to.be.false;
    expect(isEqual('hello', 'world')).to.be.false;
  });

  it('должна возвращать true, если оба аргумента равны null', () => {
    expect(isEqual(null, null)).to.be.true;
  });

  it('должна возвращать true, если оба аргумента равны undefined', () => {
    expect(isEqual(undefined, undefined)).to.be.true;
  });

  it('должна возвращать false, если один аргумент null, а другой undefined', () => {
    expect(isEqual(null, undefined)).to.be.false;
  });

  it('должна возвращать true для одного и того же объекта', () => {
    const obj = { a: 1 };
    expect(isEqual(obj, obj)).to.be.true;
  });

  it('должна возвращать true для объектов с одинаковым содержимым', () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { a: 1, b: 2 };
    expect(isEqual(obj1, obj2)).to.be.true;
  });

  it('должна возвращать false для объектов с разным количеством ключей', () => {
    const obj1 = { a: 1 };
    const obj2 = { a: 1, b: 2 };
    expect(isEqual(obj1, obj2)).to.be.false;
  });

  it('должна возвращать false для объектов с одинаковыми ключами, но разными значениями', () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { a: 1, b: 3 };
    expect(isEqual(obj1, obj2)).to.be.false;
  });

  it('должна корректно сравнивать вложенные объекты', () => {
    const obj1 = { a: { b: 2, c: 3 } };
    const obj2 = { a: { b: 2, c: 3 } };
    expect(isEqual(obj1, obj2)).to.be.true;
  });

  it('должна возвращать false для вложенных объектов с различиями', () => {
    const obj1 = { a: { b: 2, c: 3 } };
    const obj2 = { a: { b: 2, c: 4 } };
    expect(isEqual(obj1, obj2)).to.be.false;
  });

  it('должна корректно сравнивать массивы с одинаковыми значениями', () => {
    const arr1 = [1, 2, 3];
    const arr2 = [1, 2, 3];
    expect(isEqual(arr1, arr2)).to.be.true;
  });

  it('должна возвращать false для массивов с различными значениями', () => {
    const arr1 = [1, 2, 3];
    const arr2 = [1, 2, 4];
    expect(isEqual(arr1, arr2)).to.be.false;
  });

  it('должна корректно сравнивать объекты, содержащие массивы', () => {
    const obj1 = { a: [1, 2, 3] };
    const obj2 = { a: [1, 2, 3] };
    expect(isEqual(obj1, obj2)).to.be.true;
  });

  it('должна возвращать false, если сравниваются объекты разных типов', () => {
    const obj = { a: 1 };
    const arr = [1];
    expect(isEqual(obj, arr)).to.be.false;
  });
});
