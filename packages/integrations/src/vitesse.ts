import type { SchemaOrgOptions } from 'vue-schema-org'
import { createSchemaOrg } from 'vue-schema-org'
import type { ViteSSGContext } from 'vite-ssg'
import { useHead } from '@vueuse/head'

export function installSchemaOrg(ctx: ViteSSGContext, options: SchemaOrgOptions) {
  const schemaOrg = createSchemaOrg({
    ...options,
    useHead,
    useRoute: () => ctx.router.currentRoute.value,
  })
  ctx.app.use(schemaOrg)
  return schemaOrg
}
