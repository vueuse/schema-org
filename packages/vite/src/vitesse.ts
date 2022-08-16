import { createSchemaOrg } from '@vueuse/schema-org'
import type { ViteSSGContext } from 'vite-ssg'
import type { MetaInput } from './'

export function installSchemaOrg(ctx: ViteSSGContext, meta: MetaInput) {
  const ssr = !ctx.isClient

  const client = createSchemaOrg({
    updateHead(fn) {
      ctx.head?.addHeadObjs(fn)
      if (typeof document !== 'undefined')
        ctx.head?.updateDOM()
    },
    meta() {
      const inferredMeta: Record<string, any> = {}

      const tags = ctx.head?.headTags
      if (tags) {
        const headTag = tags.reverse().filter(t => t.tag === 'title' && !!t.props.children)
        if (headTag.length)
          inferredMeta.title = headTag[0].props.children
      }

      return {
        path: ctx.router.currentRoute.value.path,
        ...meta ?? {},
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
