import { Block } from '..';
import { store, StoreEvents } from '../../store';
import { Indexed } from '../../types';
import { isEqual } from '../../utils';
import { PropsType } from '../block';

type Constructor<P extends Partial<PropsType>> = new (...args: any[]) => Block<P>;

export function connect<P extends PropsType>(
    Component: Constructor<P>,
    mapStateToProps: (state: Indexed) => Partial<P>
) {
  return class extends Component {
    constructor(...args: any[]) {
      const props = args[0] || {};
      const state = mapStateToProps(store.getState());

      super({ ...props, ...state });

      store.on(StoreEvents.Updated, () => {
        const newState = mapStateToProps(store.getState());

        if (!isEqual(state, newState)) {
          this.setProps({ ...newState });
        }
      });
    }
  };
}