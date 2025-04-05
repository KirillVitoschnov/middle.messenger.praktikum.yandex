import { assert } from 'chai';
import { connect } from './';
import Block from '../block';
import { store, StoreEvents } from '../../store';

class DummyBlock extends Block<{ dummy: string }> {
  render(): DocumentFragment {
    const template = `<div>{{dummy}}</div>`;
    return this.compile(template, { ...this.props });
  }
}

describe('connect', () => {
  let originalGetState: () => any;
  let originalOn: typeof store.on;
  let fakeState: any;
  let updateCallbacks: Function[];

  beforeEach(() => {
    originalGetState = store.getState;
    originalOn = store.on;
    fakeState = { dummy: 'initial' };
    updateCallbacks = [];
    store.getState = () => fakeState;
    store.on = (event: string, callback: Function) => {
      if (event === StoreEvents.Updated) {
        updateCallbacks.push(callback);
      }
    };
  });

  afterEach(() => {
    store.getState = originalGetState;
    store.on = originalOn;
  });

  it('инициализирует компонент с данными из store', () => {
    const mapStateToProps = (state: any) => ({ dummy: state.dummy });
    const ConnectedBlock = connect(DummyBlock, mapStateToProps);
    const component = new ConnectedBlock({ dummy: 'prop' });
    assert.equal((component as any).props.dummy, 'initial');
  });

  it('обновляет пропсы при изменении store', () => {
    const mapStateToProps = (state: any) => ({ dummy: state.dummy });
    const ConnectedBlock = connect(DummyBlock, mapStateToProps);
    const component = new ConnectedBlock({ dummy: 'prop' });
    fakeState = { dummy: 'updated' };
    updateCallbacks.forEach((callback) => callback());
    assert.equal((component as any).props.dummy, 'updated');
  });
});
