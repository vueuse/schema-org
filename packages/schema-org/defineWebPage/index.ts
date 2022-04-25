import { withoutTrailingSlash } from 'ufo'
import type { Arrayable, IdReference, SchemaNodeInput, Thing } from '../types'
import type {
  NodeResolver,
} from '../utils'
import {
  IdentityId,
  defineNodeResolver,
  idReference,
  includesType,
  prefixId,
  resolveDateToIso, resolveRouteMeta, resolveType, setIfEmpty, resolveId,
} from '../utils'
import type { WebSite } from '../defineWebSite'
import { WebSiteId } from '../defineWebSite'
import type { Person } from '../definePerson'
import type { Organization } from '../defineOrganization'
import type { ImageObject } from '../defineImage'
import type { BreadcrumbList } from '../defineBreadcrumb'
import type { VideoObject } from '../defineVideo'
import type { AuthorInput } from '../shared/resolveAuthors'
import type { ReadAction } from '../shared/defineReadAction'

type ValidSubTypes = 'WebPage'|'AboutPage' |'CheckoutPage' |'CollectionPage' |'ContactPage' |'FAQPage' |'ItemPage' |'MedicalWebPage' |'ProfilePage' |'QAPage' |'RealEstateListing' |'SearchResultsPage'

/**
 * A web page.
 * Every web page is implicitly assumed to be declared to be of type WebPage,
 * so the various properties about that webpage, such as breadcrumb may be used.
 */
export interface WebPage extends Thing {
  ['@type']: Arrayable<ValidSubTypes>
  /**
   * The unmodified canonical URL of the page.
   */
  url?: string
  /**
   * The title of the page.
   */
  name: string
  /**
   * The page's meta description content.
   */
  description?: string
  /**
   * A reference-by-ID to the WebSite node.
   */
  isPartOf?: WebSite|IdReference
  /**
   * A reference-by-ID to the Organisation node.
   * Note: Only for the home page.
   */
  about?: Organization|IdReference
  /**
   * A reference-by-ID to the author of the web page.
   */
  author?: AuthorInput
  /**
   * The language code for the page; e.g., en-GB.
   */
  inLanguage?: Arrayable<string>
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
  primaryImageOfPage?: ImageObject|IdReference
  /**
   * A reference-by-ID to a node representing the page's breadrumb structure.
   */
  breadcrumb?: BreadcrumbList|IdReference
  /**
   * An array of all videos in the page content, referenced by ID.
   */
  video?: Arrayable<VideoObject|IdReference>
  /**
   * A SpeakableSpecification object which identifies any content elements suitable for spoken results.
   */
  speakable?: unknown
  /**
   * Potential actions for this web page.
   *
   * Use the `withReadAction` helper to add the read action. Note it's on by default for most page types.
   */
  potentialAction?: (ReadAction|unknown)[]
}

export type WebPageOptionalKeys = '@id'|'@type'|'isPartOf'
export type WebPageUsingRouteMeta = WebPageOptionalKeys|'name'
export type WebPageNodeResolver<T extends keyof WebPage = WebPageOptionalKeys> = NodeResolver<WebPage, T>

export const PrimaryWebPageId = '#webpage'

export function defineWebPage(webPageInput: SchemaNodeInput<WebPage, WebPageOptionalKeys>): WebPageNodeResolver
export function defineWebPage<OptionalKeys extends keyof WebPage>(webPageInput?: SchemaNodeInput<WebPage, OptionalKeys | WebPageOptionalKeys>): WebPageNodeResolver<OptionalKeys>
export function defineWebPage(webPageInput: any) {
  return defineNodeResolver<WebPage>(webPageInput, {
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
      const defaults: Partial<WebPage> = {
        '@type': type,
        '@id': prefixId(canonicalUrl, PrimaryWebPageId),
        'url': canonicalUrl,
      }
      resolveRouteMeta(defaults, currentRouteMeta, ['name', 'description', 'datePublished', 'dateModified'])
      return defaults
    },
    resolve(webPage, { canonicalUrl }) {
      resolveId(webPage, canonicalUrl)
      resolveDateToIso(webPage, 'dateModified')
      resolveDateToIso(webPage, 'datePublished')
      resolveType(webPage, 'WebPage')

      // if the type hasn't been augmented
      if (includesType(webPage, 'AboutPage') || includesType(webPage, 'WebPage')) {
        setIfEmpty(webPage, 'potentialAction', [
          {
            '@type': 'ReadAction',
            'target': [canonicalUrl],
          },
        ])
      }
      return webPage
    },
    mergeRelations(webPage, { findNode, canonicalUrl, canonicalHost }) {
      const identity = findNode<Person|Organization>(IdentityId)
      const webSite = findNode<WebSite>(WebSiteId)
      const logo = findNode<ImageObject>('#logo')
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
}
