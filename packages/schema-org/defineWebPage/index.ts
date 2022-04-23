import { withoutTrailingSlash } from 'ufo'
import type { IdReference, OptionalMeta, Thing } from '../types'
import { IdentityId, defineNodeResolver, idReference, prefixId, resolveDateToIso, setIfEmpty } from '../utils'
import type { WebSite } from '../defineWebSite'
import { WebSiteId } from '../defineWebSite'
import type { Person } from '../definePerson'
import type { Organization } from '../defineOrganization'
import type { ReadActionInput } from './withReadAction'
import { withReadAction } from './withReadAction'

type ValidSubTypes = 'WebPage'|'AboutPage' |'CheckoutPage' |'CollectionPage' |'ContactPage' |'FAQPage' |'ItemPage' |'MedicalWebPage' |'ProfilePage' |'QAPage' |'RealEstateListing' |'SearchResultsPage'

export interface WebPage extends Thing {
  ['@type']: ValidSubTypes[]|ValidSubTypes
  /**
   * The unmodified canonical URL of the page.
   */
  url?: string
  /**
   * The title of the page.
   */
  name?: string
  /**
   * A reference-by-ID to the WebSite node.
   */
  isPartOf?: IdReference
  /**
   * A reference-by-ID to the Organisation node.
   * Note: Only for the home page.
   */
  about?: IdReference
  /**
   * A reference-by-ID to the author of the web page.
   */
  author?: IdReference|IdReference[]
  /**
   * The language code for the page; e.g., en-GB.
   */
  inLanguage?: string|string[]
  /**
   * The time at which the page was originally published, in ISO 8601 format; e.g., 2015-10-31T16:10:29+00:00.
   */
  datePublished?: string|Date
  /**
   * The time at which the page was last modified, in ISO 8601 format; e.g., 2015-10-31T16:10:29+00:00.
   */
  dateModified?: string|Date
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
  potentialAction?: (ReadActionInput|unknown)[]
}

export const WebPageId = '#webpage'

export function defineWebPage(webPage: OptionalMeta<WebPage, '@id'|'@type'|'isPartOf' | 'url'|'name'> = {}) {
  const resolver = defineNodeResolver<WebPage, '@id'|'@type'|'isPartOf' | 'url'|'name'>(webPage, {
    defaults({ canonicalUrl, currentRouteMeta }) {
      // try match the @type for the canonicalUrl
      const endPath = withoutTrailingSlash(canonicalUrl.substring(canonicalUrl.lastIndexOf('/') + 1))
      let type: ValidSubTypes = 'WebPage'
      switch (endPath) {
        case 'about':
        case 'about-us':
          type = 'AboutPage'
          break
        case 'search':
          type = 'SearchResultsPage'
          break
        case 'checkout':
          type = 'CheckoutPage'
          break
        case 'contact':
        case 'get-in-touch':
        case 'contact-us':
          type = 'ContactPage'
          break
        case 'faq':
          type = 'FAQPage'
          break
      }
      return {
        '@type': type,
        '@id': prefixId(canonicalUrl, WebPageId),
        'url': canonicalUrl,
        'name': currentRouteMeta.title as string,
        'description': currentRouteMeta.description,
        'dateModified': currentRouteMeta.dateModified as string|Date,
        'datePublished': currentRouteMeta.datePublished as string|Date,
      }
    },
    resolve(webPage, { canonicalUrl }) {
      resolveDateToIso(webPage, 'dateModified')
      resolveDateToIso(webPage, 'datePublished')
      // resolve @type to an array
      if (typeof webPage['@type'] === 'string' && webPage['@type'] !== 'WebPage') {
        webPage['@type'] = [
          'WebPage',
          webPage['@type'],
        ]
      }
      const types: ValidSubTypes[] = Array.isArray(webPage['@type']) ? webPage['@type'] : [webPage['@type']]
      // if the type hasn't been augmented
      if (types.includes('AboutPage') || types.includes('WebPage')) {
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
      const webSite = findNode<WebSite>(WebSiteId)
      const logo = findNode('#logo')
      /*
       * When it's a homepage, add additional about property which references the identity of the site.
       */
      if (identity && canonicalUrl === canonicalHost) {
        setIfEmpty(webPage, 'about', idReference(identity))
        if (logo)
          setIfEmpty(webPage, 'primaryImageOfPage', idReference(logo))
      }

      if (webSite)
        setIfEmpty(webPage, 'isPartOf', idReference(webSite))

      return webPage
    },
  })

  const webPageResolver = {
    ...resolver,
    withReadAction: (readAction?: ReadActionInput) => {
      resolver.append.push({
        potentialAction: [withReadAction(readAction)],
      })
      return webPageResolver
    },
  }

  return webPageResolver
}
