import { Indexed } from '../types';

export function merge(obj1: Indexed, obj2: Indexed): Indexed {
  for (let key in obj2) {
    if (!obj2.hasOwnProperty(key)) {
      continue;
    }
    try {
      if (obj2[key]!.constructor === Object) {
        obj2[key] = merge(obj1[key] as Indexed, obj2[key] as Indexed);
      } else {
        obj1[key] = obj2[key];
      }
    } catch (e) {
      obj1[key] = obj2[key];
    }
  }

  return obj1;
}
