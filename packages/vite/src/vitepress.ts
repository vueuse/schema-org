import { SchemaOrgUnheadPlugin } from '@vueuse/schema-org'
import type { EnhanceAppContext } from 'vitepress'
import { createHead } from '@vueuse/head'
import type { UserConfig } from '@vueuse/schema-org'

export function installSchemaOrg(ctx: EnhanceAppContext, config: UserConfig) {
  // check if `createHead` has already been done
  let head = ctx.app._context.provides.usehead
  if (!head) {
    head = createHead()
    ctx.app.use(head)
  }

  head.unhead.hooks.addHooks(SchemaOrgUnheadPlugin(config, async () => {
    return {
      path: ctx.router.route.path,
      ...ctx.siteData.value,
      ...ctx.router.route.data,
      ...ctx.router.route.data.frontmatter,
    }
  }).hooks)
}
