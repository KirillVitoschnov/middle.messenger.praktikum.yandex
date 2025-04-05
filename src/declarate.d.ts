declare module '*.hbs?raw' {
  const _: string;
  export default _;
}

declare interface Window {
  Buffer: typeof import('buffer').Buffer;
  crypto: typeof import('crypto-browserify');
}

declare module 'crypto-browserify' {
  import * as crypto from 'crypto';
  export = crypto;
}
