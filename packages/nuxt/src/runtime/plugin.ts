import { SchemaOrgUnheadPlugin } from '@unhead/schema-org-vue'
// @ts-expect-error untyped
import config from '#nuxt-schema-org/config'
import { defineNuxtPlugin, useRouter } from '#app'
import { unref } from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
  const head = nuxtApp.vueApp._context.provides.usehead

  const router = useRouter()
  const currentRoute = router.currentRoute

  head.use(SchemaOrgUnheadPlugin(config, async () => {
    const route = unref(currentRoute)
    const meta = {
      ...config,
      path: route.path,
      ...route.meta,
    }
    await nuxtApp.hooks.callHook('schema-org:meta', meta)
    return meta
  }))
})
