import type { IdReference, OptionalMeta, Thing } from '../types'
import { IdentityId, defineNodeResolverSchema, idReference, prefixId, setIfEmpty } from '../utils'
import type { Person } from '../definePerson'
import type { Organization } from '../defineOrganization'

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
  publisher?: IdReference
  /**
   * A SearchAction object describing the site's internal search.
   */
  potentialAction?: unknown
  /**
   * The language code for the WebSite; e.g., en-GB.
   * If the website is available in multiple languages, then output an array of inLanguage values.
   */
  inLanguage?: string|string[]
}

export const WebSiteId = '#website'

export function defineWebSite(websitePartial: OptionalMeta<WebSite, '@type'|'@id'|'url'>) {
  return defineNodeResolverSchema<WebSite, '@type'|'@id'|'url'>(websitePartial, {
    defaults({ canonicalHost }) {
      return {
        '@type': 'WebSite',
        '@id': prefixId(canonicalHost, WebSiteId),
        'url': canonicalHost,
      }
    },
    mergeRelations(webSite, { findNode }) {
      const identity = findNode<Person|Organization>(IdentityId)
      if (identity)
        setIfEmpty(webSite, 'publisher', idReference(identity))

      return webSite
    },
  })
}
