import { computed, watchEffect } from 'vue'
import type { HeadClient } from '@vueuse/head'
import { injectHead } from '@vueuse/head'

export function useVueUseHead(headClient?: HeadClient) {
  let _domSetup = false

  return ({ schemaRef, debug }: any) => {
    let head: HeadClient | null = null
    try {
      // head may not be available in SSR (vitepress)
      head = headClient || injectHead()
    }
    catch (e) {
      debug('DOM setup failed, couldn\'t fetch injectHead')
    }
    if (!head)
      return

    // we only need to init the DOM once since we have a reactive head object and a watcher to update the DOM
    if (_domSetup)
      return

    head.addHeadObjs(computed(() => {
      return {
        // Can be static or computed
        script: [
          {
            'type': 'application/ld+json',
            'data-id': 'schema-org-graph',
            'key': 'schema-org-graph',
            'children': schemaRef.value,
          },
        ],
      }
    }))
    watchEffect(() => {
      if (head && typeof window !== 'undefined')
        head.updateDOM()
    })
    _domSetup = true
  }
}
