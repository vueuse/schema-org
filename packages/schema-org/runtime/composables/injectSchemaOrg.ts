import { PROVIDE_KEY } from '@vueuse/schema-org'
import type { SchemaOrgVuePlugin } from '@vueuse/schema-org'
import { inject } from 'vue'

export function injectSchemaOrg() {
  let client: SchemaOrgVuePlugin | undefined
  try {
    client = inject<SchemaOrgVuePlugin>(PROVIDE_KEY)
  }
  catch (e) {}

  if (!client)
    throw new Error('[@vueuse/schema-org] Failed to find plugin, you may have forgotten to apply app.use(schemaOrg)')

  return client
}
