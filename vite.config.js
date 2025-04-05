import { defineConfig } from "vite";
import { resolve } from "path";
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
    plugins: [
        nodePolyfills({
            globals: {
                Buffer: true,
                global: true,
                process: true,
            },
            protocolImports: true,
        }),
    ],
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
            },
        },
        commonjsOptions: {
            transformMixedEsModules: true,
        },
        target: 'es2020',
    },
    css: {
        postcss: "./postcss.config.cjs",
    },
    resolve: {
        alias: {
            crypto: 'crypto-browserify',
            stream: 'stream-browserify',
            buffer: 'buffer/',
        },
    },
    define: {
        'process.env': {},
        global: 'window',
    },
});
