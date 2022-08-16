import { useNuxtApp } from '#app'

export { useSchemaOrg } from '@vueuse/schema-org/runtime'

export function injectSchemaOrg() {
  const nuxtApp = useNuxtApp()
  // their may be no schema available
  if (nuxtApp._injectSchemaOrg)
    return nuxtApp._injectSchemaOrg()
}
