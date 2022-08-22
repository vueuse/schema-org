import { createSchemaOrg } from '@vueuse/schema-org'
import { defineNuxtPlugin } from '#app'
import { unref, watch } from '#imports'
import config from '#build/nuxt-schema-org-config.mjs'

export default defineNuxtPlugin(async (nuxtApp) => {
  const ssr = !!nuxtApp.ssrContext?.url

  const client = createSchemaOrg({
    updateHead(fn) {
      // @todo once nuxt full static is working
      // if (ssr)
      //   nuxtApp.payload.data.schemaOrg = unref(fn)
      // computed so only need to be done once
      nuxtApp._useHead(unref(fn))
    },
    async meta() {
      const head = nuxtApp.vueApp._context.provides.usehead

      const inferredMeta: Record<string, any> = {}
      const headTag = head.headTags.reverse().filter(t => t.tag === 'title' && !!t.props.children)
      if (headTag.length)
        inferredMeta.title = headTag[0].props.children

      const schemaOrgMeta = {
        path: nuxtApp._route.path,
        ...inferredMeta,
        ...nuxtApp._route.meta,
        ...config.meta || {},
      }
      await nuxtApp.hooks.callHook('schema-org:meta', schemaOrgMeta)
      return schemaOrgMeta
    },
  })

  nuxtApp.vueApp.use(client)

  if (ssr) {
    await client.forceRefresh()
    return
  }

  watch(() => nuxtApp._route.path, () => {
    client.forceRefresh()
  })
})
