import { defineConfig } from "vite";
import { resolve } from 'path';
import { webcrypto } from 'crypto';

if (!globalThis.crypto) {
    globalThis.crypto = webcrypto;
}

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html')
            },
        },
    },
    css: {
        postcss: './postcss.config.cjs'
    },
});
