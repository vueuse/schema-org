import type { IdReference, OptionalMeta, Thing } from '../types'
import { defineNodeResolverSchema, idReference, setIfEmpty } from '../utils'
import { IdentityId } from '../defineIdentity'
import { WebSiteId } from '../defineWebSite'

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

export const WebPageId = '#webpage'

export function defineWebPage(webPage: OptionalMeta<WebPage, 'isPartOf' | 'url' | 'name'> = {}) {
  return defineNodeResolverSchema<WebPage>(webPage, {
    defaults: {
      '@type': 'WebPage',
      '@id': WebPageId,
    },
    resolve(webPage, { routeCanonicalUrl }) {
      setIfEmpty(webPage, 'url', routeCanonicalUrl())
      return webPage
    },
    mergeRelations(webPage, { findNode, routeCanonicalUrl, canonicalHost }) {
      const identity = findNode(IdentityId)
      const webSite = findNode(WebSiteId)
      /*
       * When it's a homepage, add additional about property which references the identity of the site.
       */
      if (identity && routeCanonicalUrl() === canonicalHost)
        setIfEmpty(webPage, 'about', idReference(identity))

      if (webSite)
        setIfEmpty(webPage, 'isPartOf', idReference(webSite))

      return webPage
    },
  })
}
