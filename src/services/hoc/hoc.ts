import { isEqual } from '../../utils';
import { Block } from '../';
import { store, StoreEvents } from '../../store';
import { Indexed } from '../../types';

export function connect<T extends Indexed, U extends Indexed>(
    Component: new (props: T & U) => Block,
    mapStateToProps: (state: Indexed) => U
) {
  return class extends Component {
    constructor(props: T) {
      // Получаем часть состояния из стора и приводим её к типу U.
      let state: U = mapStateToProps(store.getState());

      // Передаём объединённые пропсы: родительские (T) и данные из стора (U).
      super({ ...props, ...state });

      // Подписываемся на обновления стора.
      store.on(StoreEvents.Updated, () => {
        const newState: U = mapStateToProps(store.getState());
        // Если данные изменились, обновляем свойства компонента.
        if (!isEqual(state, newState)) {
          this.setProps({ ...newState });
        }
        state = newState;
      });
    }
  };
}
