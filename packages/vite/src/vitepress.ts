import type { SchemaOrgOptions } from '@vueuse/schema-org'
import { createSchemaOrg, useVueUseHead } from '@vueuse/schema-org'
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
    provider: {
      setupDOM: useVueUseHead(head),
      // @ts-expect-error vitepress uses different router which we account for with the provider config above
      useRoute: () => ctx.router.route,
      name: 'vitepress',
    },
  })

  // @ts-expect-error vue version mistmatch
  ctx.app.use(schemaOrg)

  schemaOrg.setupDOM()
  return schemaOrg
}
