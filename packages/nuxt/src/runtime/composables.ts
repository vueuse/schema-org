import { isFunction } from '@vue/shared'
import { computed } from 'vue'
import { useNuxtApp } from '#app'

export * from '@vueuse/schema-org'

export function useSchemaOrg(input) {
  const resolveInput = isFunction(input) ? computed(input) : input
  useNuxtApp()._useSchemaOrg(resolveInput)
}
