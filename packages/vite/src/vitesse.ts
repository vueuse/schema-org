import { createSchemaOrg, resolveUserConfig } from '@vueuse/schema-org'
import type { ViteSSGContext } from 'vite-ssg'
import type { UserConfig } from '@vueuse/schema-org'

export function installSchemaOrg(ctx: ViteSSGContext, config: UserConfig) {
  const ssr = !ctx.isClient

  const resolvedConfig = resolveUserConfig(config)

  const client = createSchemaOrg({
    updateHead(fn) {
      ctx.head?.addHeadObjs(fn)
      if (typeof document !== 'undefined')
        ctx.head?.updateDOM()
    },
    meta() {
      const inferredMeta: Record<string, any> = {}

      const tags = ctx.head?.headTags?.reverse()
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
        path: ctx.router.currentRoute.value.path,
        ...inferredMeta,
        ...resolvedConfig.meta,
        ...ctx.router.currentRoute.value.meta,
      }
    },
  })

  ctx.app.use(client)

  if (ssr) {
    client.generateSchema()
    client.setupDOM()
    return
  }

  ctx.router.afterEach(() => {
    client.generateSchema()
    client.setupDOM()
  })
  return client
}
