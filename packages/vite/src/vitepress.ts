import type { SchemaOrgOptions } from '@vueuse/schema-org'
import { createSchemaOrg } from '@vueuse/schema-org'
import type { EnhanceAppContext } from 'vitepress'
import { createHead } from '@vueuse/head'

export function installSchemaOrg(ctx: EnhanceAppContext, options: SchemaOrgOptions) {
  // check if `createHead` has already been done
  let head = ctx.app._context.provides.usehead
  if (!head) {
    head = createHead()
    ctx.app.use(head)
  }

  const schemaOrg = createSchemaOrg({
    ...options,
    customRouteMetaResolver: () => {
      return {
        ...ctx.router.route.data,
        ...ctx.router.route.data.frontmatter,
      }
    },
    head,
    useRoute: () => ctx.router.route,
  })

  ctx.app.use(schemaOrg)
  return schemaOrg
}
