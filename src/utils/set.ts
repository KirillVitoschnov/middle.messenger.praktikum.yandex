import { Indexed } from '../types';
import { merge } from './merge';

export function set(object: Indexed | unknown, path: string, value: unknown): Indexed | unknown {
  if (typeof path !== 'string') {
    throw new Error('path must be string');
  }
  if (typeof object !== 'object' || object === null) {
    return object;
  }
  type NestedObject = { [key: string]: unknown };
  const result = path.split('.').reduceRight<NestedObject>(
    (acc, key) => ({
      [key]: acc,
    }),
    value as NestedObject,
  );
  return merge(object as Indexed, result);
}
