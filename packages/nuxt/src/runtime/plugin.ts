import { SchemaOrgUnheadPlugin } from '@unhead/schema-org-vue'
// @ts-expect-error untyped
import config from '#nuxt-schema-org/config'
import { defineNuxtPlugin, useRouter } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  const head = nuxtApp.vueApp._context.provides.usehead

  const router = useRouter()
  const currentRoute = router.currentRoute
  head.hooks.addHooks(SchemaOrgUnheadPlugin(config, async () => {
    const route = currentRoute.value
    const meta = {
      ...config,
      path: route.path,
      ...route.meta,
    }
    await nuxtApp.hooks.callHook('schema-org:meta', meta)
    return meta
  }).hooks)
})
