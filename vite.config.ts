import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'path'

// import dts from 'vite-plugin-dts'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import VueDevTools from 'vite-plugin-vue-devtools'
import { transformLazyShow } from 'v-lazy-show'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // VueDevTools(),
    vue({ template: { compilerOptions: { nodeTransforms: [transformLazyShow] } } }),
    vueJsx(),
    // dts(),
  ],
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'vex-ui',
      // the proper extensions will be added
      fileName: 'vex-ui',
    },
    copyPublicDir: false,
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  publicDir: 'playground/public',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
