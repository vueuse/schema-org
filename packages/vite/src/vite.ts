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
    meta() {
      const inferredMeta: Record<string, any> = {}

      const tags = head.headTags?.reverse()
      if (tags) {
        const headTag = tags.filter(t => t.tag === 'title' && !!t.props.children)
        if (headTag.length)
          inferredMeta.title = headTag[0].props.children
        const descTag = tags.filter(t => t.tag === 'meta' && t.props.name === 'description' && !!t.props.content)
        if (descTag.length)
          inferredMeta.description = descTag[0].props.content
        const imageTag = tags.filter(t => t.tag === 'meta' && t.props.property === 'og:image' && !!t.props.content)
        if (imageTag.length)
          inferredMeta.image = imageTag[0].props.content
      }

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
