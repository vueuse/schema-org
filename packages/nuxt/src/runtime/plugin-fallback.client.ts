import { defineNuxtPlugin } from '#app'
import { watch } from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
  if (nuxtApp.payload.data?.schemaOrg) {
    nuxtApp._useHead(nuxtApp.payload.data.schemaOrg)
  }
  else {
    // remove script to avoid confusion
    watch(() => nuxtApp._route.path, () => {
      document.querySelector('script[data-id="schema-org-graph"]')?.remove()
    })
  }
})
