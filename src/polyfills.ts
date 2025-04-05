const isNode = typeof window === 'undefined';

// eslint-disable-next-line @typescript-eslint/no-require-imports
export const CRYPTO = (isNode ? require('crypto') : window.crypto) as { randomUUID: () => string };
