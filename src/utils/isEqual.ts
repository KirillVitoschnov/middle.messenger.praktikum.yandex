import { PlainObject } from '../types';

export function isEqual(obj1: unknown, obj2: unknown): boolean {
  if (obj1 === obj2) {
    return true;
  }
  if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
    return false;
  }
  const keys1 = Object.keys(obj1 as PlainObject);
  const keys2 = Object.keys(obj2 as PlainObject);
  if (keys1.length !== keys2.length) {
    return false;
  }
  for (const key of keys1) {
    if (!keys2.includes(key) || !isEqual((obj1 as PlainObject)[key], (obj2 as PlainObject)[key])) {
      return false;
    }
  }
  return true;
}
