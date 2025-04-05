import { defineConfig } from "vite";
import { resolve } from "path";
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
    plugins: [
        nodePolyfills(),
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
    },
    css: {
        postcss: "./postcss.config.cjs",
    },
    resolve: {
        alias: {
            crypto: 'crypto-browserify',
        },
    },
});
