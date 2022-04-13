import { defu } from 'defu'
import type { IdReference, OptionalMeta, Thing } from '../types'
import { useSchemaOrg } from '../useSchemaOrg'
import { resolveWebSiteId } from './defineWebSite'
import { resolveIdentityId } from './defineIdentity'

export interface WebPage extends Thing {
  /**
   * The unmodified canonical URL of the page.
   */
  url: string
  /**
   * The title of the page.
   */
  name: string
  /**
   * A reference-by-ID to the WebSite node.
   */
  isPartOf: IdReference
  /**
   * A reference-by-ID to the Organisation node.
   * Note: Only for the home page.
   */
  about?: IdReference
  /**
   * The language code for the page; e.g., en-GB.
   */
  inLanguage?: string|string[]
  /**
   * The time at which the page was originally published, in ISO 8601 format; e.g., 2015-10-31T16:10:29+00:00.
   */
  datePublished?: string
  /**
   * The time at which the page was last modified, in ISO 8601 format; e.g., 2015-10-31T16:10:29+00:00.
   */
  dateModified?: string
  /**
   * A reference-by-ID to a node representing the page's featured image.
   */
  primaryImageOfPage?: IdReference
  /**
   * A reference-by-ID to a node representing the page's breadrumb structure.
   */
  breadcrumb?: IdReference
  /**
   * An array of all images in the page content, referenced by ID (including the image referenced by the primaryImageOfPage).
   */
  image?: IdReference[]
  /**
   * An array of all videos in the page content, referenced by ID.
   */
  video?: IdReference[]
  /**
   * A SpeakableSpecification object which identifies any content elements suitable for spoken results.
   */
  speakable?: unknown
}

export const resolveWebPageId = () => {
  const { resolvePathId } = useSchemaOrg()

  return resolvePathId('webpage')
}

export function defineWebPage(webPage: OptionalMeta<WebPage, 'isPartOf' | 'url' | 'name'> = {}) {
  const { routeCanonicalUrl } = useSchemaOrg()

  const defaults: Partial<WebPage> = {
    '@type': 'WebPage',
    '@id': resolveWebPageId(),
    'url': routeCanonicalUrl(),
  }

  // mergeRouteMeta(defaults)

  // link website id
  if (!defaults.isPartOf) {
    defaults.isPartOf = {
      '@id': resolveWebSiteId(),
    }
  }

  if (!defaults.about) {
    //const route = useRoute()
    //if (route && route.path === '/') {
      defaults.about = {
        '@id': resolveIdentityId(),
      }
    //}
  }
  return defu(webPage, defaults) as WebPage
}
