import type { SchemaOrgOptions } from 'vueuse-schema-org'
import { createSchemaOrg } from 'vueuse-schema-org'
import type { ViteSSGContext } from 'vite-ssg'

export function installSchemaOrg(ctx: ViteSSGContext, options: SchemaOrgOptions) {
  const schemaOrg = createSchemaOrg({
    ...options,
    useRoute: () => ctx.router.currentRoute.value,
  })
  ctx.app.use(schemaOrg)
  return schemaOrg
}
