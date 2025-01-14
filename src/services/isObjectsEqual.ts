export type PlainObject<T = any> = {
  [k in string]: T;
};

function isArray(value: unknown): boolean {
  return Array.isArray(value);
}

function isPlainObject(value: unknown): boolean {
  return (
    typeof value === 'object' &&
    value !== null &&
    value.constructor === Object &&
    Object.prototype.toString.call(value) === '[object Object]'
  );
}

function isArrayOrObject(value: unknown) {
  return isArray(value) || isPlainObject(value);
}

export default function isObjectsEqual(obj1: PlainObject, obj2: PlainObject) {
  if (Object.keys.length !== Object.keys.length) {
    return false;
  }

  for (let [key, value] of Object.entries(obj1)) {
    let rightValue = obj2[key];
    if (isArrayOrObject(rightValue) && isArrayOrObject(value)) {
      if (isObjectsEqual(value, rightValue)) {
        continue;
      }
      return false;
    }
    if (value !== rightValue) {
      return false;
    }
  }
  return true;
}
