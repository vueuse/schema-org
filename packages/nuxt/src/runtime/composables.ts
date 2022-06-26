import { isFunction } from '@vue/shared'
import { computed } from 'vue'
import { useNuxtApp } from '#app'

// eslint-disable-next-line import/export
export * from '@vueuse/schema-org'

// eslint-disable-next-line import/export
export function useSchemaOrg(schema) {
  const resolvedSchema = isFunction(schema) ? computed(schema) : schema
  useNuxtApp()._useSchemaOrg(resolvedSchema)
}
