type PlainObject<T = any> = {
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

export function isEqual(obj1: PlainObject, obj2: PlainObject): boolean {
  if (obj1 === obj2) {
    return true;
  }
  if (
      typeof obj1 !== 'object' || obj1 === null ||
      typeof obj2 !== 'object' || obj2 === null
  ) {
    return obj1 === obj2;
  }
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }
  for (const key of keys1) {
    if (!keys2.includes(key) || !isEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}
