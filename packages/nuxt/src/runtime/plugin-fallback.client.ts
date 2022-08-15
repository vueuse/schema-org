import { defineNuxtPlugin } from '#app'
import { watch } from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
  // remove script to avoid confusion
  watch(() => nuxtApp._route.path, () => {
    document.querySelector('script[data-id="schema-org-graph"]')?.remove()
  })
})
