import { withoutTrailingSlash } from 'ufo'
import type { DeepPartial } from 'utility-types'
import type { Arrayable, MaybeIdReference, MaybeRef, ResolvableDate, SchemaNodeInput, Thing } from '../../types'
import {
  IdentityId,
  defineSchemaResolver,
  idReference, prefixId, resolveDateToIso, resolveId, resolveRouteMeta, resolveType, setIfEmpty,
} from '../../utils'
import type { WebSite } from '../WebSite'
import { PrimaryWebSiteId } from '../WebSite'
import type { ChildPersonInput, Person } from '../Person'
import type { Organization } from '../Organization'
import type { Image, SingleImageInput } from '../Image'
import type { Breadcrumb } from '../Breadcrumb'
import type { Video } from '../Video'
import { PrimaryBreadcrumbId } from '../Breadcrumb'
import { defineSchemaOrgComponent } from '../../components/defineSchemaOrgComponent'
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
  author?: ChildPersonInput
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
  breadcrumb?: MaybeIdReference<Breadcrumb>
  /**
   * An array of all videos in the page content, referenced by ID.
   */
  video?: Arrayable<MaybeIdReference<Video>>
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
  defineWebPage(input as WebPage)

export function defineWebPage<T extends SchemaNodeInput<WebPage>>(input: MaybeRef<T>) {
  return defineSchemaResolver<T, WebPage>(input as T, {
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

      if (webPage['@type'] === 'WebPage') {
        // if the type hasn't been augmented
        setIfEmpty(webPage, 'potentialAction', [
          {
            '@type': 'ReadAction',
            'target': [ctx.canonicalUrl],
          },
        ])
      }
      return webPage
    },
    rootNodeResolve(webPage, { findNode, canonicalUrl, canonicalHost }) {
      const identity = findNode<Person | Organization>(IdentityId)
      const webSite = findNode<WebSite>(PrimaryWebSiteId)
      const logo = findNode<Image>('#logo')

      /*
       * When it's a homepage, add additional about property which references the identity of the site.
       */
      if (identity && canonicalUrl === canonicalHost)
        setIfEmpty(webPage, 'about', idReference(identity))

      if (logo)
        setIfEmpty(webPage, 'primaryImageOfPage', idReference(logo))

      if (webSite)
        setIfEmpty(webPage, 'isPartOf', idReference(webSite))

      // it's possible that adding a new web page will revert the breadcrumb data
      const breadcrumb = findNode<Breadcrumb>(PrimaryBreadcrumbId)
      if (breadcrumb)
        setIfEmpty(webPage, 'breadcrumb', idReference(breadcrumb))

      return webPage
    },
  })
}

export const SchemaOrgWebPage = defineSchemaOrgComponent('SchemaOrgWebPage', defineWebPage)
