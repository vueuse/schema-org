import type { Arrayable, IdReference, ResolvableDate, SchemaNodeInput, Thing } from '../types'
import type { NodeResolver } from '../utils'
import {
  IdentityId,
  defineNodeResolver,
  idReference,
  prefixId,
  resolveDateToIso,
  resolveId, resolveRouteMeta, resolveType, setIfEmpty,
} from '../utils'
import type { WebPage } from '../defineWebPage'
import { PrimaryWebPageId } from '../defineWebPage'
import type { Organization } from '../defineOrganization'
import type { Person } from '../definePerson'
import type { ImageObject } from '../defineImage'
import type { VideoObject } from '../defineVideo'
import type { AuthorInput } from '../shared/resolveAuthors'
import { resolveAuthor } from '../shared/resolveAuthors'

type ValidArticleSubTypes = 'Article'|'AdvertiserContentArticle'|'NewsArticle'|'Report'|'SatiricalArticle'|'ScholarlyArticle'|'SocialMediaPosting'|'TechArticle'

export interface Article extends Thing {
  ['@type']: Arrayable<ValidArticleSubTypes>
  /**
   * The headline of the article (falling back to the title of the WebPage).
   * Headlines should not exceed 110 characters.
   */
  headline: string
  /**
   * A summary of the article (falling back to the page's meta description content).
   */
  description: string
  /**
   * A reference-by-ID to the WebPage node.
   */
  isPartOf?: IdReference
  /**
   * The time at which the article was originally published, in ISO 8601 format; e.g., 2015-10-31T16:10:29+00:00.
   */
  datePublished: ResolvableDate
  /**
   * The time at which the article was last modified, in ISO 8601 format; e.g., 2015-10-31T16:10:29+00:00.
   */
  dateModified?: ResolvableDate
  /**
   * A reference-by-ID to the author of the article.
   */
  author: AuthorInput
  /**
   * A reference-by-ID to the publisher of the article.
   */
  publisher: IdReference|Person|Organization
  /**
   * An array of all videos in the article content, referenced by ID.
   */
  video?: Arrayable<IdReference|VideoObject>
  /**
   * An array of references by ID to comment pieces.
   */
  comment?: Arrayable<IdReference|Comment>
  /**
   * A thumbnail image relevant to the Article.
   */
  thumbnailUrl?: string
  /**
   * An integer value of the number of comments associated with the article.
   */
  commentCount?: number
  /**
   * An integer value of the number of words in the article.
   */
  wordCount?: number
  /**
   * An array of keywords which the article has (e.g., ["cats","dogs","cake"]).
   */
  keywords?: string[]
  /**
   * An array of category names which the article belongs to (e.g., ["cats","dogs","cake"]).
   */
  articleSection?: string[]
  /**
   * The language code for the article; e.g., en-GB.
   */
  inLanguage?: string
  /**
   * A SpeakableSpecification object which identifies any content elements suitable for spoken results.
   */
  speakable?: unknown
  /**
   * The year from which the article holds copyright status.
   */
  copyrightYear?: string
  /**
   * A reference-by-ID to the Organization or Person who holds the copyright.
   */
  copyrightHolder?: IdReference|Person|Organization
}

export const ArticleId = '#article'

export type ArticleOptionalKeys = '@id'|'@type'|'publisher'|'author'
export type ArticleUsingRouteMeta = ArticleOptionalKeys|'headline'|'description'

export type ArticleNodeResolver<T extends keyof Article = ArticleOptionalKeys> = NodeResolver<Article, T>

/**
 * Describes an Article on a WebPage.
 */
// Default input
export function defineArticle(articleInput: SchemaNodeInput<Article, ArticleOptionalKeys>): ArticleNodeResolver
// Support swapping out the required fields
export function defineArticle<OptionalKeys extends keyof Article>(articleInput?: SchemaNodeInput<Article, OptionalKeys | ArticleOptionalKeys>): ArticleNodeResolver<OptionalKeys>
export function defineArticle(articleInput: any) {
  return defineNodeResolver<Article>(articleInput, {
    defaults({ canonicalUrl, currentRouteMeta, options }) {
      const defaults: Partial<Article> = {
        '@type': 'Article',
        '@id': prefixId(canonicalUrl, ArticleId),
        'inLanguage': options.defaultLanguage,
      }
      resolveRouteMeta(defaults, currentRouteMeta, [
        'headline',
        'description',
        'image',
        'dateModified',
        'datePublished',
      ])
      return defaults
    },
    resolve(article, { canonicalUrl }) {
      resolveId(article, canonicalUrl)
      resolveAuthor(article, 'author')
      resolveDateToIso(article, 'dateModified')
      resolveDateToIso(article, 'datePublished')
      resolveType(article, 'Article')
      return article
    },
    mergeRelations(article, { findNode, canonicalUrl }) {
      const webPage = findNode<WebPage>(PrimaryWebPageId)
      const identity = findNode<Organization|Person>(IdentityId)

      if (article.image && !article.thumbnailUrl) {
        const firstImage = (Array.isArray(article.image) ? article.image[0] : article.image) as ImageObject
        setIfEmpty(article, 'thumbnailUrl', findNode<ImageObject>(firstImage['@id'])?.url)
      }

      if (identity) {
        setIfEmpty(article, 'publisher', idReference(identity))
        setIfEmpty(article, 'author', idReference(identity))
      }

      if (webPage) {
        setIfEmpty(article, 'isPartOf', idReference(webPage))
        setIfEmpty(article, 'mainEntityOfPage', idReference(webPage))
        setIfEmpty(webPage, 'potentialAction', [
          {
            '@type': 'ReadAction',
            'target': [canonicalUrl],
          },
        ])
        // clone the dates to the webpage
        setIfEmpty(webPage, 'dateModified', article.dateModified)
        setIfEmpty(webPage, 'datePublished', article.datePublished)
        // setIfEmpty(webPage, 'author', article.author)
      }
      return article
    },
  })
}
