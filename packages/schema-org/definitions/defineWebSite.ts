import { defu } from 'defu'
import type { IdReference, OptionalMeta, Thing } from '../types'
import { useSchemaOrg } from '../useSchemaOrg'
import { resolveIdentityId } from './defineIdentity'

export interface WebSite extends Thing {
  '@type': 'WebSite'
  /**
   * The site's home URL (excluding a trailing slash).
   */
  url: string
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

export function resolveWebSiteId() {
  const { resolveHostId } = useSchemaOrg()
  return resolveHostId('website')
}

export function defineWebSite(website: OptionalMeta<WebSite, 'url'>) {
  const { canonicalHost } = useSchemaOrg()

  const resolvedWebsite = defu(website, {
    '@type': 'WebSite',
    '@id': resolveWebSiteId(),
  }) as WebSite

  if (!resolvedWebsite.url)
    resolvedWebsite.url = canonicalHost

  if (!resolvedWebsite.publisher) {
    resolvedWebsite.publisher = {
      '@id': resolveIdentityId(),
    }
  }

  return resolvedWebsite
}
