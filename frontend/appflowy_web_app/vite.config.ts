import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import wasm from 'vite-plugin-wasm';
import Terminal from 'vite-plugin-terminal';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    wasm(),
    Terminal(),
    svgr({
      svgrOptions: {
        prettier: false,
        plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
        icon: true,
        svgoConfig: {
          multipass: true,
          plugins: [
            {
              name: 'preset-default',
              params: {
                overrides: {
                  removeViewBox: false,
                },
              },
            },
          ],
        },
        svgProps: {
          role: 'img',
        },
        replaceAttrValues: {
          '#333': 'currentColor',
        },
      },
    }),
  ],
  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  // prevent vite from obscuring rust errors
  clearScreen: false,
  // tauri expects a fixed port, fail if that port is not available
  server: {
    port: process.env.TAURI_PLATFORM ? 5173 : 3000,
    strictPort: true,
    watch: {
      ignored: ['**/__tests__/**'],
    },
    // proxy: {
    //   '/api': {
    //     target: 'https://test.appflowy.cloud',
    //     changeOrigin: true,
    //     secure: false,
    //   },
    // },
  },
  envPrefix: ['AF', 'TAURI_'],
  build: process.env.TAURI_PLATFORM
    ? {
      // Tauri supports es2021
      target: process.env.TAURI_PLATFORM === 'windows' ? 'chrome105' : 'safari13',
      // don't minify for debug builds
      minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
      // produce sourcemaps for debug builds
      sourcemap: !!process.env.TAURI_DEBUG,
    }
    : {
      minify: process.env.NODE_ENV === 'production' ? 'esbuild' : false,
      sourcemap: process.env.NODE_ENV !== 'production',
    },
  resolve: {
    alias: [
      { find: 'src/', replacement: `${__dirname}/src/` },
      { find: '@/', replacement: `${__dirname}/src/` },
    ],
  },

  optimizeDeps: {
    include: ['@mui/material/Tooltip'],
  },
});
