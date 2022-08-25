// Simple alias to avoid breaking changes
import { AliasRuntime, schemaAutoImports } from '@vueuse/schema-org'
import SchemaOrg from '@vueuse/schema-org/vite'

export * from '@vueuse/schema-org'
export { SchemaOrg }

export const schemaOrgAutoImports = {
  [AliasRuntime]: schemaAutoImports,
}
