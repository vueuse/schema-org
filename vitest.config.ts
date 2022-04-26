/* eslint-disable spaced-comment */
/// <reference types="vitest" />
/// <reference types="vitest/globals" />

import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      '@vueuse/schema-org': resolve(__dirname, 'packages/schema-org/index.ts'),
      '@vueuse/schema-org-components': resolve(__dirname, 'packages/components/index.ts'),
    },
    dedupe: [
      'vue',
      'vue-demi',
      '@vue/runtime-core',
    ],
  },
  define: {
    __VUE_OPTIONS_API__: 'true',
    __VUE_PROD_DEVTOOLS__: 'false',
  },
  optimizeDeps: {
    exclude: ['vue-demi'],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [resolve(__dirname, 'packages/.test/setup.ts')],
    reporters: 'dot',
    deps: {
      inline: [
        '@vueuse/core',
        'vue2',
        '@vue/composition-api',
        'vue-demi',
      ],
    },
  },
})
