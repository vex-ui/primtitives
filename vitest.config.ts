import { fileURLToPath } from 'node:url'
import { mergeConfig } from 'vite'
import { defineConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      root: fileURLToPath(new URL('./', import.meta.url)),
      include: ['./src/**/*.test.ts', './src/**/*.test.tsx'],
      exclude: ['node_modules', 'dist', '.idea', '.git', '.cache', '/playwright'],
    },
  })
)
