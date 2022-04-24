/* eslint-disable spaced-comment */
/// <reference types="vitest" />
/// <reference types="vitest/globals" />

import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      'vue-schema-org': resolve(__dirname, 'packages/schema-org/index.ts'),
      'vue-schema-org-components': resolve(__dirname, 'packages/components/index.ts'),
    },
    dedupe: [
      'vue',
      '@vueuse/core',
      'vue-demi',
      '@vue/runtime-core',
    ],
  },
  define: {
    __VUE_OPTIONS_API__: 'true',
    __VUE_PROD_DEVTOOLS__: 'false',
  },
  optimizeDeps: {
    exclude: ['@vueuse/core', 'vue-demi'],
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
