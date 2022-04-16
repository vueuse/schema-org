import type { IdReference, OptionalMeta, Thing } from '../types'
import {defineNodeResolverSchema, IdentityId, idReference, prefixId, setIfEmpty} from '../utils'
import { WebSiteId } from '../defineWebSite'
import {Person} from "../definePerson";
import {Organization} from "../defineOrganization";

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
  /**
   * @todo
   */
  potentialAction: unknown
}

export const WebPageId = '#webpage'

export function defineWebPage(webPage: OptionalMeta<WebPage, 'isPartOf' | 'url' | 'name'> = {}) {
  return defineNodeResolverSchema<WebPage>(webPage, {
    defaults({ canonicalUrl, currentRouteMeta }) {
      return {
        '@type': 'WebPage',
        '@id': prefixId(canonicalUrl, WebPageId),
        'url': canonicalUrl,
        'name': currentRouteMeta.title as string,
      }
    },
    resolve(webPage, { canonicalUrl }) {
      if (webPage['@type'] === 'WebPage') {
        webPage.potentialAction = [
          {
            '@type': 'ReadAction',
            'target': [canonicalUrl],
          },
        ]
      }
      return webPage
    },
    mergeRelations(webPage, { findNode, canonicalUrl, canonicalHost }) {
      const identity = findNode<Person|Organization>(IdentityId)
      const webSite = findNode(WebSiteId)
      /*
       * When it's a homepage, add additional about property which references the identity of the site.
       */
      if (identity && canonicalUrl === canonicalHost) {
        setIfEmpty(webPage, 'about', idReference(identity))
        setIfEmpty(webPage, 'primaryImageOfPage', idReference('#logo'))
      }

      if (webSite)
        setIfEmpty(webPage, 'isPartOf', idReference(webSite))

      return webPage
    },
  })
}
