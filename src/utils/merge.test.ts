import { expect } from 'chai';
import { merge } from './merge';

describe('Функция merge', () => {
  it('должна объединять два объекта с примитивными значениями', () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { b: 3, c: 4 };
    const result = merge(obj1, obj2);
    expect(result).to.deep.equal({ a: 1, b: 3, c: 4 });
  });

  it('должна рекурсивно объединять вложенные объекты', () => {
    const obj1 = { a: { x: 1, y: 2 }, b: 2 };
    const obj2 = { a: { y: 20, z: 30 }, c: 4 };
    const result = merge(obj1, obj2);
    expect(result).to.deep.equal({ a: { x: 1, y: 20, z: 30 }, b: 2, c: 4 });
  });

  it('должна перезаписывать вложенные объекты, если значение не является объектом', () => {
    const obj1 = { a: { x: 1 } };
    const obj2 = { a: 2 };
    const result = merge(obj1, obj2);
    expect(result).to.deep.equal({ a: 2 });
  });

  it('должна добавлять новые ключи из второго объекта, если их нет в первом', () => {
    const obj1 = { a: 1 };
    const obj2 = { b: 2 };
    const result = merge(obj1, obj2);
    expect(result).to.deep.equal({ a: 1, b: 2 });
  });

  it('должна корректно обрабатывать массивы: перезаписывать, а не объединять', () => {
    const obj1 = { a: [1, 2, 3] };
    const obj2 = { a: [4, 5] };
    const result = merge(obj1, obj2);
    expect(result).to.deep.equal({ a: [4, 5] });
  });

  it('должна возвращать тот же объект obj1 (мутация первого объекта)', () => {
    const obj1 = { a: 1 };
    const obj2 = { b: 2 };
    const result = merge(obj1, obj2);
    expect(result).to.equal(obj1);
  });

  it('должна корректно объединять сложные вложенные структуры', () => {
    const obj1 = {
      a: 1,
      b: {
        c: 2,
        d: {
          e: 3,
        },
      },
    };
    const obj2 = {
      b: {
        c: 20,
        d: {
          f: 4,
        },
      },
      g: 5,
    };
    const result = merge(obj1, obj2);
    expect(result).to.deep.equal({
      a: 1,
      b: {
        c: 20,
        d: {
          e: 3,
          f: 4,
        },
      },
      g: 5,
    });
  });
});
