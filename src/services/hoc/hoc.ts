import { isEqual } from '../../utils';
import { Block } from '../';
import { store, StoreEvents } from '../../store';
import { Indexed } from '../../types';

export function connect(Component: typeof Block, mapStateToProps: (state: Indexed) => Indexed) {
  return class extends Component {
    constructor(props) {
      let state = mapStateToProps(store.getState());

      super({ ...props, ...state });

      store.on(StoreEvents.Updated, () => {
        const newState = mapStateToProps(store.getState());
        console.log('hoc', state, newState);
        if (!isEqual(state, newState)) {
          console.log('hoc: не одинаковые', state, newState);
          this.setProps({ ...newState });
        }

        state = newState;
      });
    }
  };
}

// export function connect(Component: typeof Block) {
//   return class extends Component {
//     constructor(props: {} | undefined) {
//       super({ ...props, ...store.getState() });

//       store.on(StoreEvents.Updated, () => {
//         this.setProps({ ...store.getState() });
//       });
//       //console.log('HOC', this.props);
//     }
//   };
// }
