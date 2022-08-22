import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hooks.hook('schema-org:meta', (meta) => {
    if (nuxtApp._route.path === '/plugin-override') {
      meta.host = 'https://override-example.com'
      meta.url = `${meta.host}${meta.path}`
    }
  })
})
