import type { SchemaOrgOptions } from '@vueuse/schema-org'
import { createSchemaOrg, useVueUseHead } from '@vueuse/schema-org'
import type { ViteSSGContext } from 'vite-ssg'

export function installSchemaOrg(ctx: ViteSSGContext, options: SchemaOrgOptions) {
  const schemaOrg = createSchemaOrg({
    ...options,
    provider: {
      setupDOM: useVueUseHead(ctx.head),
      name: 'vitesse',
      useRoute: () => ctx.router.currentRoute.value,
    },
  })
  ctx.app.use(schemaOrg)

  schemaOrg.setupDOM()
  return schemaOrg
}
