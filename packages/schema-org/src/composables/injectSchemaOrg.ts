import { inject } from 'vue'
import type { SchemaOrgVuePlugin } from './createSchemaOrg'

export function injectSchemaOrg() {
  let client: SchemaOrgVuePlugin | undefined
  try {
    client = inject<SchemaOrgVuePlugin>('schemaorg')
  }
  catch (e) {}

  if (!client)
    console.warn('[@vueuse/schema-org] Failed to find plugin, you may have forgotten to apply app.use(schemaOrg)')

  return client
}
