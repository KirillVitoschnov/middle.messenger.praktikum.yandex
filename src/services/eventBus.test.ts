import { assert } from 'chai';
import EventBus from './eventBus';

describe('EventBus', () => {
  it('должен вызывать зарегистрированный обработчик', () => {
    let result = 0;
    const bus = new EventBus<{ test: [number] }>();
    bus.on('test', (value) => {
      result = value;
    });
    bus.emit('test', 42);
    assert.equal(result, 42);
  });

  it('не должен вызывать обработчик после удаления', () => {
    let result = 0;
    const bus = new EventBus<{ test: [number] }>();
    const handler = (value: number) => {
      result = value;
    };
    bus.on('test', handler);
    bus.off('test', handler);
    bus.emit('test', 42);
    assert.equal(result, 0);
  });

  it('должен корректно обрабатывать несколько обработчиков', () => {
    let result1 = 0;
    let result2 = 0;
    const bus = new EventBus<{ test: [number] }>();
    bus.on('test', (value) => {
      result1 = value;
    });
    bus.on('test', (value) => {
      result2 = value;
    });
    bus.emit('test', 7);
    assert.equal(result1, 7);
    assert.equal(result2, 7);
  });

  it('должен ловить ошибки в обработчике и продолжать выполнение', () => {
    let result = 0;
    const bus = new EventBus<{ test: [number] }>();
    bus.on('test', () => {
      throw new Error('Ошибка');
    });
    bus.on('test', (value) => {
      result = value;
    });
    const errorStub: any[] = [];
    const originalConsoleError = console.error;
    console.error = () => {
      errorStub.push(true);
    };
    bus.emit('test', 99);
    console.error = originalConsoleError;
    assert.equal(result, 99);
    assert.isNotEmpty(errorStub);
  });

  it('должен выводить предупреждение, если нет слушателей', () => {
    const bus = new EventBus<{ test: [number] }>();
    let warnCalled = false;
    const originalWarn = console.warn;
    console.warn = () => {
      warnCalled = true;
    };
    bus.emit('test', 123);
    console.warn = originalWarn;
    assert.isTrue(warnCalled);
  });

  it('должен выводить предупреждение, если удаляем несуществующий обработчик', () => {
    const bus = new EventBus<{ test: [number] }>();
    let warnCalled = false;
    const originalWarn = console.warn;
    console.warn = () => {
      warnCalled = true;
    };
    bus.off('test', () => {});
    console.warn = originalWarn;
    assert.isTrue(warnCalled);
  });
});
