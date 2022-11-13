import type { UserConfig } from '@vueuse/schema-org'
import { createSchemaOrg, resolveUserConfig } from '@vueuse/schema-org'
import type { EnhanceAppContext } from 'iles'

export function installSchemaOrg(ctx: EnhanceAppContext, config: UserConfig) {
  if (!config.canonicalHost)
    config.canonicalHost = ctx.site.url
  const resolvedConfig = resolveUserConfig(config)

  const client = createSchemaOrg({
    position: 'head',
    updateHead(fn) {
      ctx.head.addHeadObjs(fn)
      if (typeof document !== 'undefined')
        ctx.head.updateDOM()
    },
    async meta() {
      const inferredMeta: Record<string, any> = {}

      let tags: { tag: string; props: any; children?: string }[] = []
      // @ts-expect-error version mismatch
      if (typeof ctx.head.resolveTags === 'function')
        // @ts-expect-error version mismatch
        tags = await ctx.head.resolveTags()
      else if (typeof ctx.head.headTags === 'object')
        tags = ctx.head.headTags
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
        path: ctx.router?.currentRoute.value.path || '/',
        ...inferredMeta,
        ...resolvedConfig.meta,
        ...ctx.meta,
        ...ctx.frontmatter,
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

  ctx.router.afterEach(() => {
    client.generateSchema()
    client.setupDOM()
  })
  return client
}
