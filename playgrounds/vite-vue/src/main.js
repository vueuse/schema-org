import { createApp } from 'vue'
import { createSchemaOrg } from '@vueuse/schema-org'
import App from './App.vue'

const app = createApp(App)

const schemaOrg = createSchemaOrg({
  canonicalHost: 'https://vite.org',
  defaultLanguage: 'en-US',
})
app.use(schemaOrg)

app.mount('#app')
