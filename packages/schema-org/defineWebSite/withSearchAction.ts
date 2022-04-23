import { defu } from 'defu'
import { ensureBase } from '../utils'
import type { WebSiteNodeResolver } from './index'

export interface WithSearchActionInput {
  /**
   * An object of type EntryPoint, with a relative URL which describes the URL pattern of the internal search function
   * (e.g., /search?query={search_term_string}).
   */
  target: `${string}{search_term_string}${string|undefined}`
  /**
   * Alias: The search term string as described in the target (e.g., search_term_string).
   * @default search_term_string
   */
  queryInput?: string
}

export interface SearchAction {
  '@type': 'SearchAction'
  /**
   * An object of type EntryPoint, with a relative URL which describes the URL pattern of the internal search function
   * (e.g., /search?query={search_term_string}).
   */
  target: {
    '@type': 'EntryPoint'
    'urlTemplate': string
  }
  /**
   * The search term string as described in the target (e.g., search_term_string).
   */
  'query-input': {
    '@type': 'PropertyValueSpecification'
    'valueRequired': boolean
    'valueName': string
  }
}

export function withSearchAction(resolver: WebSiteNodeResolver) {
  return (searchActionInput: WithSearchActionInput) => {
    resolver.append.push(({ canonicalHost }) => {
      const searchAction = defu({
        'target': {
          '@type': 'EntryPoint',
          'urlTemplate': searchActionInput.target,
        },
        'query-input': {
          '@type': 'PropertyValueSpecification',
          'valueRequired': true,
          'valueName': searchActionInput.queryInput,
        },
      }, {
        '@type': 'SearchAction',
        'target': {
          '@type': 'EntryPoint',
          'urlTemplate': '',
        },
        'query-input': {
          '@type': 'PropertyValueSpecification',
          'valueRequired': true,
          'valueName': 'search_term_string',
        },
      }) as SearchAction
      searchAction.target.urlTemplate = ensureBase(canonicalHost, searchAction.target.urlTemplate)
      return {
        potentialAction: [searchAction],
      }
    })
    return resolver
  }
}
