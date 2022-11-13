import { createSchemaOrg, resolveUserConfig } from '@vueuse/schema-org'
import type { UserConfig } from '@vueuse/schema-org'
import type { App } from 'vue'
import { createHead } from '@vueuse/head'
import type { Router } from 'vue-router'
import type { HeadClient } from '@vueuse/head'

export function installSchemaOrg(ctx: { app: App; router?: Router }, config: UserConfig) {
  const resolvedConfig = resolveUserConfig(config)

  let head = ctx.app._context.provides.usehead as HeadClient
  if (!head) {
    head = createHead()
    ctx.app.use(head)
  }

  const client = createSchemaOrg({
    updateHead(fn) {
      head.addHeadObjs(fn)
      if (typeof document !== 'undefined')
        head.updateDOM()
    },
    async meta() {
      const inferredMeta: Record<string, any> = {}

      let tags: { tag: string; props: any; children?: string }[] = []
      // @ts-expect-error version mismatch
      if (typeof head.resolveTags === 'function')
        // @ts-expect-error version mismatch
        tags = await head.resolveTags()
      else if (typeof head.headTags === 'object')
        tags = head.headTags
      else if (typeof head.headTags === 'function')
        // @ts-expect-error version mismatch
        tags = await head.headTags()

      tags = tags.reverse()

      const titleTag = tags.find(t => t.tag === 'title' && (!!t.props.children || !!t.children))
      if (titleTag)
        inferredMeta.title = titleTag.props.children || titleTag.children
      const descTag = tags.find(t => t.tag === 'meta' && t.props.name === 'description' && !!t.props.content)
      if (descTag)
        inferredMeta.description = descTag.props.content
      const imageTag = tags.find(t => t.tag === 'meta' && t.props.property === 'og:image' && !!t.props.content)
      if (imageTag)
        inferredMeta.image = imageTag.props.content

      return {
        path: ctx.router?.currentRoute.value.path || '/',
        ...inferredMeta,
        ...resolvedConfig.meta,
        ...ctx.router?.currentRoute.value.meta || {},
      }
    },
  })

  ctx.app.use(client)

  if (typeof document === 'undefined') {
    client.generateSchema()
    client.setupDOM()
    return
  }

  if (ctx.router) {
    ctx.router.afterEach(() => {
      client.generateSchema()
      client.setupDOM()
    })
  }
  return client
}
