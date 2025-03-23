import { Block } from '..';
import { store, StoreEvents } from '../../store';
import { Indexed } from '../../types';
import { isEqual } from '../../utils';
import { PropsType } from '../block';

type Constructor<P extends PropsType> = new (props?: P) => Block<P> & { render(): DocumentFragment };

export function connect<P extends PropsType>(
    Component: Constructor<P>,
    mapStateToProps: (state: Indexed) => Partial<P>
) {
  return class extends Component {
    constructor(props: P = {} as P) {
      const stateProps = mapStateToProps(store.getState());
      super({ ...props, ...stateProps });
      store.on(StoreEvents.Updated, () => {
        const newState = mapStateToProps(store.getState());
        if (!isEqual(stateProps, newState)) {
          this.setProps({ ...newState });
        }
      });
    }
  };
}
