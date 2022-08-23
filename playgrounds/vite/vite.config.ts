import { URL, fileURLToPath } from 'node:url'
import { dirname, resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { AliasRuntimePluginVite as SchemaOrg } from '@vueuse/schema-org-vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    SchemaOrg(),
  ],
  resolve: {
    alias: {
      '@vueuse/schema-org': resolve(__dirname, '../../packages/schema-org/dist'),
      '@vueuse/schema-org-vite': resolve(__dirname, '../../packages/vite/dist'),
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
