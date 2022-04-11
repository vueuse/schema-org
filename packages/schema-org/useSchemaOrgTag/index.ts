import type { Thing } from 'schema-dts'
import { defu } from 'defu'
import { useJsonLdTag } from '../useJsonLdTag'

/**
 * Async script tag loading.
 *
 * @see https://vueuse.org/useScriptTag
 */
export function useSchemaOrgTag<T extends Thing>(schema?: T) {
  if (!schema) {
    if (!document) {
      return
    }
    return document.head.querySelectorAll('script[type="application/ld+json"]')
  }
  // ensure context
  return useJsonLdTag(defu<T>(schema, {
    '@context': 'https://schema.org',
  }))
}
