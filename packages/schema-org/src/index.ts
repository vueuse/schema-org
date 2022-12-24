import { useHead } from '@vueuse/head'

export * from '@unhead/schema-org-vue'

let isSPA: null | true = null

// we manually define this to use the useHead from @vueuse/head instead of @unhead/vue
export function useSchemaOrg(input?: any): any {
  // if we're not in development, and we already have a schema org entry, do nothing
  // Note: usage of this function should be removed by the bundler in production
  if (process.env.NODE_ENV !== 'development' && typeof window !== 'undefined') {
    if (isSPA === null && !window.document.querySelector('#schema-org-graph'))
      isSPA = true
    if (!isSPA)
      return
  }
  return useHead({
    script: [
      {
        type: 'application/ld+json',
        key: 'schema-org-graph',
        id: 'schema-org-graph',
        // @ts-expect-error runtime
        nodes: input,
      },
    ],
  }, { mode: isSPA ? 'all' : 'server' })
}
