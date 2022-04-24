import type { Arrayable, IdReference, Thing, WithAmbigiousFields } from '../types'
import type { NodeResolver } from '../utils'
import { IdentityId, defineNodeResolver, idReference, prefixId, setIfEmpty } from '../utils'
import type { Person } from '../definePerson'
import type { Organization } from '../defineOrganization'
import type { SearchAction, WithSearchActionInput } from './withSearchAction'
import { withSearchAction } from './withSearchAction'

/**
 * A WebSite is a set of related web pages and other items typically served from a single web domain and accessible via URLs.
 */
export interface WebSite extends Thing {
  '@type': 'WebSite'
  /**
   * The site's home URL (excluding a trailing slash).
   */
  url?: string
  /**
   * The name of the website.
   */
  name: string
  /**
   * A description of the website (e.g., the site's tagline).
   */
  description?: string
  /**
   * A reference-by-ID to the Organization which publishes the WebSite
   * (or an array of Organization and Person in the case that the website represents an individual).
   */
  publisher?: Arrayable<IdReference|Person|Organization>
  /**
   * A SearchAction object describing the site's internal search.
   */
  potentialAction?: (SearchAction|unknown)[]
  /**
   * The language code for the WebSite; e.g., en-GB.
   * If the website is available in multiple languages, then output an array of inLanguage values.
   */
  inLanguage?: Arrayable<string>
}

export type WebSiteNodeResolver = NodeResolver<WebSite> & {
  withSearchAction: (searchActionInput: WithSearchActionInput) => WebSiteNodeResolver
}

export const WebSiteId = '#website'

export function defineWebSite(websitePartial: WithAmbigiousFields<WebSite, '@type'|'@id'|'url'>): WebSiteNodeResolver {
  const resolver = defineNodeResolver<WebSite, '@type'|'@id'|'url'>(websitePartial, {
    defaults({ canonicalHost, options }) {
      return {
        '@type': 'WebSite',
        '@id': prefixId(canonicalHost, WebSiteId),
        'url': canonicalHost,
        'inLanguage': options.defaultLanguage,
      }
    },
    mergeRelations(webSite, { findNode }) {
      const identity = findNode<Person|Organization>(IdentityId)
      if (identity)
        setIfEmpty(webSite, 'publisher', idReference(identity))

      return webSite
    },
  })

  const webSiteResolver = {
    ...resolver,
    withSearchAction: (searchAction: WithSearchActionInput) => withSearchAction(webSiteResolver)(searchAction),
  }

  return webSiteResolver
}
