import type { UserConfig } from '@vueuse/schema-org'
import { SchemaOrgUnheadPlugin } from '@vueuse/schema-org'
import type { EnhanceAppContext } from 'iles'

export function installSchemaOrg(ctx: EnhanceAppContext, config: UserConfig) {
  if (!config.canonicalHost)
    config.canonicalHost = ctx.site.url
  // @ts-expect-error version mismatch
  if (!ctx.head!.unhead)
    return
  // @ts-expect-error version mismatch
  ctx.head!.unhead.use(SchemaOrgUnheadPlugin(config, async () => {
    return {
      path: ctx.router?.currentRoute.value.path || '/',
      ...ctx.meta,
      ...ctx.frontmatter,
      ...ctx.router?.currentRoute.value.meta || {},
    }
  }))
}
