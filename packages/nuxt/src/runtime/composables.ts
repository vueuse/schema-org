import { isFunction } from '@vue/shared'
import { computed } from 'vue'
import { useNuxtApp } from '#app'

export * from '@vueuse/schema-org'

export function useSchemaOrg(schema) {
  const resolvedSchema = isFunction(schema) ? computed(schema) : schema
  useNuxtApp()._useSchemaOrg(resolvedSchema)
}
