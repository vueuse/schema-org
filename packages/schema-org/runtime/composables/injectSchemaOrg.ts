import { PROVIDE_KEY } from '@vueuse/schema-org'
import type { SchemaOrgClient } from '@vueuse/schema-org'
import { inject } from 'vue'

export function injectSchemaOrg() {
  let client: SchemaOrgClient | undefined
  try {
    client = inject<SchemaOrgClient>(PROVIDE_KEY)
  }
  catch (e) {}

  if (!client)
    throw new Error('[@vueuse/schema-org] Failed to find plugin, you may have forgotten to apply app.use(schemaOrg)')

  return client
}
