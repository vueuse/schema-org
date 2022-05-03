import { withoutTrailingSlash } from 'ufo'
import type { DeepPartial } from 'utility-types'
import type { Arrayable, MaybeIdReference, MaybeRef, ResolvableDate, SchemaNodeInput, Thing } from '../types'
import {
  IdentityId,
  callAsPartial,
  defineRootNodeResolver,
  idReference, prefixId, resolveDateToIso, resolveId, resolveRouteMeta, resolveType, setIfEmpty,
} from '../utils'
import type { WebSite } from '../defineWebSite'
import { WebSiteId } from '../defineWebSite'
import type { Person } from '../definePerson'
import type { Organization } from '../defineOrganization'
import type { ImageObject } from '../defineImage'
import type { BreadcrumbList } from '../defineBreadcrumb'
import type { VideoObject } from '../defineVideo'
import type { AuthorInput } from '../shared/resolveAuthors'
import type { SingleImageInput } from '../shared/resolveImages'
import { PrimaryBreadcrumbId } from '../defineBreadcrumb'
import type { ReadAction } from './asReadAction'

type ValidSubTypes = 'WebPage' | 'AboutPage' | 'CheckoutPage' | 'CollectionPage' | 'ContactPage' | 'FAQPage' | 'ItemPage' | 'MedicalWebPage' | 'ProfilePage' | 'QAPage' | 'RealEstateListing' | 'SearchResultsPage'

export * from './asReadAction'

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
  isPartOf?: MaybeIdReference<WebSite>
  /**
   * A reference-by-ID to the Organisation node.
   * Note: Only for the home page.
   */
  about?: MaybeIdReference<Organization>
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
  datePublished?: ResolvableDate
  /**
   * The time at which the page was last modified, in ISO 8601 format; e.g., 2015-10-31T16:10:29+00:00.
   */
  dateModified?: ResolvableDate
  /**
   * A reference-by-ID to a node representing the page's featured image.
   */
  primaryImageOfPage?: SingleImageInput
  /**
   * A reference-by-ID to a node representing the page's breadrumb structure.
   */
  breadcrumb?: MaybeIdReference<BreadcrumbList>
  /**
   * An array of all videos in the page content, referenced by ID.
   */
  video?: Arrayable<MaybeIdReference<VideoObject>>
  /**
   * A SpeakableSpecification object which identifies any content elements suitable for spoken results.
   */
  speakable?: unknown
  /**
   * Potential actions for this web page.
   *
   * Note it's on by default for most page types.
   */
  potentialAction?: (ReadAction | unknown)[]
}

export const PrimaryWebPageId = '#webpage'

export const defineWebPagePartial = <K>(input?: DeepPartial<WebPage> & K) =>
  // hacky way for users to get around strict typing when using custom schema, route meta or augmentation
  callAsPartial(defineWebPage, input)

export function defineWebPage<T extends SchemaNodeInput<WebPage>>(input: MaybeRef<T>) {
  return defineRootNodeResolver<T, WebPage>(input, {
    required: [
      'name',
      'isPartOf',
    ],
    defaults({ canonicalUrl, meta }) {
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
      resolveRouteMeta(defaults, meta, ['name', 'description', 'datePublished', 'dateModified'])
      return defaults
    },
    resolve(webPage, ctx) {
      resolveId(webPage, ctx.canonicalUrl)
      if (webPage.dateModified)
        webPage.dateModified = resolveDateToIso(webPage.dateModified)

      if (webPage.datePublished)
        webPage.datePublished = resolveDateToIso(webPage.datePublished)

      if (webPage['@type'])
        webPage['@type'] = resolveType(webPage['@type'], 'WebPage') as Arrayable<ValidSubTypes>

      // actions may be a function that need resolving
      webPage.potentialAction = webPage.potentialAction?.map(a => typeof a === 'function' ? a(ctx) : a)
      return webPage
    },
    mergeRelations(webPage, { findNode, canonicalUrl, canonicalHost }) {
      const identity = findNode<Person | Organization>(IdentityId)
      const webSite = findNode<WebSite>(WebSiteId)
      const logo = findNode<ImageObject>('#logo')

      if (webPage['@type'] === 'WebPage') {
        // if the type hasn't been augmented
        setIfEmpty(webPage, 'potentialAction', [
          {
            '@type': 'ReadAction',
            'target': [canonicalUrl],
          },
        ])
      }
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

      // it's possible that adding a new web page will revert the breadcrumb data
      const breadcrumb = findNode<BreadcrumbList>(PrimaryBreadcrumbId)
      if (breadcrumb)
        setIfEmpty(webPage, 'breadcrumb', idReference(breadcrumb))

      return webPage
    },
  })
}
