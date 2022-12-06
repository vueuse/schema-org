import { useHead } from '@vueuse/head'

export * from '@unhead/schema-org-vue'

export function useSchemaOrg(input?: any): any {
  // if (process.env.NODE_ENV !== 'development') {
  //   return
  // }
  return useHead({
    script: [
      {
        type: 'application/ld+json',
        key: 'schema-org-graph',
        nodes: input,
      },
    ],
  })
}
