import { URL, fileURLToPath } from 'node:url'
import { dirname, resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const __dirname = dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@vueuse/schema-org-vite': resolve(__dirname, '../../packages/vite/dist'),
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
