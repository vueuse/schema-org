import { createApp } from 'vue'
import { SchemaOrgUnheadPlugin } from '@vueuse/schema-org'
import { createHead } from '@vueuse/head'
import App from './App.vue'
import router from './router'
import './assets/main.css'

const app = createApp(App)

app.use(router)

const head = createHead()
head.use(SchemaOrgUnheadPlugin({
  // config
  host: 'https://example.com',
  // needed for iles
  tagPosition: 'head',
}, () => {
  const route = router.currentRoute.value
  return {
    path: route.path,
    ...route.meta,
  }
}))
app.use(head)

app.mount('#app')
