import { resolve } from 'path'
import type { AliasOptions } from 'vite'
import { defineConfig } from 'vite'

const r = (p: string) => resolve(__dirname, p)

export const alias: AliasOptions = {
  'unrouted': r('./packages/unrouted/src/'),
  '@unrouted/core': r('./packages/core/src/'),
  '@unrouted/test-kit': r('./packages/test-kit/src/'),
  '@unrouted/fetch': r('./packages/fetch/src/'),
  '@unrouted/plugins': r('./packages/plugins/src/'),
  '@unrouted/preset-api': r('./packages/preset-api/src/'),
  '@unrouted/preset-node': r('./packages/preset-node/src/'),
}

export default defineConfig({
  optimizeDeps: {
    entries: [],
  },
  resolve: {
    alias,
  },
})
