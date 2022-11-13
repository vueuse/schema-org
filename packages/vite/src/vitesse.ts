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
    async meta() {
      const inferredMeta: Record<string, any> = {}

      let tags: { tag: string; props: any; children?: string }[] = []
      // @ts-expect-error version mismatch
      if (typeof ctx.head.resolveTags === 'function')
        // @ts-expect-error version mismatch
        tags = await ctx.head.resolveTags()
      // @ts-expect-error version mismatch
      else if (typeof ctx.head.headTags === 'object')
        // @ts-expect-error version mismatch
        tags = ctx.head.headTags
      // @ts-expect-error version mismatch
      else if (typeof ctx.head.headTags === 'function')
        // @ts-expect-error version mismatch
        tags = await ctx.head.headTags()

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
