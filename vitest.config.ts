/// <reference types="vitest" />
/// <reference types="vitest/globals" />

import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      '@vueuse/schema-org': resolve(__dirname, 'packages/schema-org/index.ts'),
    },
    dedupe: [
      'vue',
      '@vue/runtime-core',
    ],
  },
  define: {
    __VUE_OPTIONS_API__: 'true',
    __VUE_PROD_DEVTOOLS__: 'false',
  },
  test: {
    globals: true,
    environment: 'jsdom',
    // setupFiles: [resolve(__dirname, 'packages/.test/setup.ts')],
    reporters: 'dot',
    deps: {
      inline: [
        '@vueuse/core',
        '@vue/composition-api',
      ],
    },
  },
})
