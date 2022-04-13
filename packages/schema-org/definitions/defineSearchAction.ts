import type { Thing } from '../types'
import { useSchemaOrg } from '../useSchemaOrg'

export interface SearchAction extends Thing {
  /**
   * An object of type EntryPoint, with a relative URL which describes the URL pattern of the internal search function
   * (e.g., /search?query={search_term_string}).
   */
  target: string
  /**
   * The search term string as described in the target (e.g., search_term_string).
   * @default search_term_string
   */
  queryInput?: string
}

export function defineSearchAction(searchAction: SearchAction) {
  const { routeCanonicalUrl } = useSchemaOrg()
  return {
    '@type': 'SearchAction',
    'target': routeCanonicalUrl(searchAction.target),
    'query-input': {
      '@type': 'PropertyValueSpecification',
      'valueRequired': true,
      'valueName': searchAction.queryInput || 'search_term_string',
    },
  }
}
