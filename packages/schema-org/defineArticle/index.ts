import type { IdReference, OptionalMeta, Thing } from '../types'
import { IdentityId, defineNodeResolverSchema, idReference, prefixId, resolveDateToIso, setIfEmpty } from '../utils'
import { WebPageId } from '../defineWebPage'

type ValidArticleSubTypes = 'AdvertiserContentArticle'|'NewsArticle'|'Report'|'SatiricalArticle'|'ScholarlyArticle'|'SocialMediaPosting'|'TechArticle'

export interface Article extends Thing {
  ['@type']: 'Article'|['Article', ValidArticleSubTypes]
  /**
   * The headline of the article (falling back to the title of the WebPage).
   * Headlines should not exceed 110 characters.
   */
  headline?: string
  /**
   * A summary of the article (falling back to the page's meta description content).
   */
  description?: string
  /**
   * A reference-by-ID to the WebPage node.
   */
  isPartOf?: IdReference
  /**
   * A reference-by-ID to the WebPage node.
   */
  mainEntityOfPage?: IdReference
  /**
   * The time at which the article was originally published, in ISO 8601 format; e.g., 2015-10-31T16:10:29+00:00.
   */
  datePublished: string|Date
  /**
   * The time at which the article was last modified, in ISO 8601 format; e.g., 2015-10-31T16:10:29+00:00.
   */
  dateModified: string|Date
  /**
   * A reference-by-ID to the author of the article.
   */
  author?: IdReference|IdReference[]
  /**
   * A reference-by-ID to the publisher of the article.
   */
  publisher?: IdReference
  /**
   * An image object (or array of all images in the article content), referenced by ID.
   * - Must be at least 696 pixels wide.
   * - Must be of the following formats+file extensions: .jpg, .png, .gif ,or .webp.
   */
  image?: IdReference|IdReference[]
  /**
   * An array of all videos in the article content, referenced by ID.
   */
  video?: IdReference[]
  /**
   * An array of references by ID to comment pieces.
   */
  comment?: IdReference[]
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
  copyrightHolder?: IdReference
  /**
   * @todo
   */
  potentialAction: unknown
}

export const ArticleId = '#article'

/**
 * Describes an Article on a WebPage.
 */
export function defineArticle(articlePartial: OptionalMeta<Article, '@type'>) {
  return defineNodeResolverSchema<Article>(articlePartial, {
    defaults({ canonicalUrl, currentRouteMeta, options }) {
      return {
        '@type': 'Article',
        '@id': prefixId(canonicalUrl, ArticleId),
        'headline': currentRouteMeta.title as string,
        'description': currentRouteMeta.description as string,
        'inLanguage': options.defaultLanguage,
      }
    },
    resolve(article) {
      resolveDateToIso(article, 'dateModified')
      resolveDateToIso(article, 'datePublished')
      return article
    },
    mergeRelations(article, { findNode, canonicalUrl }) {
      const webPage = findNode(WebPageId)
      const identity = findNode(IdentityId)

      if (identity)
        article.publisher = idReference(identity)

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
      }
      return article
    },
  })
}
