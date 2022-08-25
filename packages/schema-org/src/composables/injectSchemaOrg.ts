import { inject } from 'vue'
import { PROVIDE_KEY } from './createSchemaOrg'
import type { SchemaOrgVuePlugin } from './createSchemaOrg'

export function injectSchemaOrg() {
  let client: SchemaOrgVuePlugin | undefined
  try {
    client = inject<SchemaOrgVuePlugin>(PROVIDE_KEY)
  }
  catch (e) {}

  if (!client)
    console.warn('[@vueuse/schema-org] Failed to find plugin, you may have forgotten to apply app.use(schemaOrg)')

  return client
}
