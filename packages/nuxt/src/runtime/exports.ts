import { isFunction } from '@vue/shared'
import { computed } from '#imports'
import { useNuxtApp } from '#app'

export function useSchemaOrg(input) {
  console.log('useSchemaOrg', input)
  const nuxtApp = useNuxtApp()
  if (nuxtApp._useSchemaOrg)
    nuxtApp._useSchemaOrg(isFunction(input) ? computed(input) : input)
}


