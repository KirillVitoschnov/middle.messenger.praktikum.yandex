import { expect } from 'chai';
import { getEqual } from './getEqual';

describe('Функция getEqual', () => {
  it('должна возвращать true для одинаковых чисел', () => {
    expect(getEqual(5, 5)).to.be.true;
  });

  it('должна возвращать false для разных чисел', () => {
    expect(getEqual(5, 10)).to.be.false;
  });

  it('должна возвращать true для одинаковых строк', () => {
    expect(getEqual('test', 'test')).to.be.true;
  });

  it('должна возвращать false для разных строк', () => {
    expect(getEqual('test', 'Test')).to.be.false;
  });

  it('должна возвращать true для одинаковых булевых значений', () => {
    expect(getEqual(true, true)).to.be.true;
  });

  it('должна возвращать false для разных булевых значений', () => {
    expect(getEqual(true, false)).to.be.false;
  });

  it('должна возвращать true, если оба аргумента равны null', () => {
    expect(getEqual(null, null)).to.be.true;
  });

  it('должна возвращать true, если оба аргумента равны undefined', () => {
    expect(getEqual(undefined, undefined)).to.be.true;
  });

  it('должна возвращать false, если один аргумент null, а другой undefined', () => {
    expect(getEqual(null, undefined)).to.be.false;
  });

  it('должна возвращать true для одного и того же объекта', () => {
    const obj = { a: 1 };
    expect(getEqual(obj, obj)).to.be.true;
  });

  it('должна возвращать false для разных объектов с одинаковым содержимым', () => {
    expect(getEqual({ a: 1 }, { a: 1 })).to.be.false;
  });

  it('должна возвращать true для одного и того же массива', () => {
    const arr = [1, 2, 3];
    expect(getEqual(arr, arr)).to.be.true;
  });

  it('должна возвращать false для разных массивов с одинаковым содержимым', () => {
    expect(getEqual([1, 2, 3], [1, 2, 3])).to.be.false;
  });
});
