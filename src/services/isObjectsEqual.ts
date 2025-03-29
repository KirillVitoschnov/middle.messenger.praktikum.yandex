import { PlainObject } from '../types';

function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

function isPlainObject(value: unknown): value is PlainObject {
  return (
    typeof value === 'object' &&
    value !== null &&
    value.constructor === Object &&
    Object.prototype.toString.call(value) === '[object Object]'
  );
}

function isArrayOrObject(value: unknown): value is PlainObject | unknown[] {
  return isArray(value) || isPlainObject(value);
}

export default function isObjectsEqual(obj1: unknown, obj2: unknown): boolean {
  if (isArrayOrObject(obj1) && isArrayOrObject(obj2)) {
    if (isArray(obj1) && isArray(obj2)) {
      if (obj1.length !== obj2.length) {
        return false;
      }
      for (let i = 0; i < obj1.length; i++) {
        if (!isObjectsEqual(obj1[i], obj2[i])) {
          return false;
        }
      }
      return true;
    }
    if (isArray(obj1) || isArray(obj2)) {
      return false;
    }
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) {
      return false;
    }
    for (const key of keys1) {
      if (!Object.prototype.hasOwnProperty.call(obj2, key)) {
        return false;
      }
      if (!isObjectsEqual(obj1[key], obj2[key])) {
        return false;
      }
    }
    return true;
  }
  return obj1 === obj2;
}
