import { createSchemaOrg } from '@vueuse/schema-org'
import type { ResolvedMeta } from 'schema-org-graph-js'
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

      let tags: { tag: string; props: any; children?: string }[] = []
      if (typeof head.resolveTags === 'function')
        tags = await head.resolveTags()
      else if (typeof head.headTags === 'object')
        tags = head.headTags
      else if (typeof head.headTags === 'function')
        tags = await head.headTags()

      tags = tags.reverse()

      const inferredMeta = {} as ResolvedMeta
      const titleTag = tags.find(t => t.tag === 'title' && (!!t.props.children || !!t.children))
      if (titleTag)
        inferredMeta.title = titleTag.props.children || titleTag.children
      const descTag = tags.find(t => t.tag === 'meta' && t.props.name === 'description' && !!t.props.content)
      if (descTag)
        inferredMeta.description = descTag.props.content
      const imageTag = tags.find(t => t.tag === 'meta' && t.props.property === 'og:image' && !!t.props.content)
      if (imageTag)
        inferredMeta.image = imageTag.props.content
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
