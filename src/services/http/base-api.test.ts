import { expect } from 'chai';
import { BaseAPI } from './base-api';

describe('BaseAPI', () => {
  let api: BaseAPI;

  beforeEach(() => {
    api = new BaseAPI();
  });

  it('Метод create() выбрасывает ошибку "Not implemented"', () => {
    expect(() => api.create()).to.throw(Error, 'Not implemented');
  });

  it('Метод request() выбрасывает ошибку "Not implemented"', () => {
    expect(() => api.request()).to.throw(Error, 'Not implemented');
  });

  it('Метод update() выбрасывает ошибку "Not implemented"', () => {
    expect(() => api.update()).to.throw(Error, 'Not implemented');
  });

  it('Метод delete() выбрасывает ошибку "Not implemented"', () => {
    expect(() => api.delete()).to.throw(Error, 'Not implemented');
  });
});
