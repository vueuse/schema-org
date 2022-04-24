import type { Arrayable, IdReference, Thing, WithAmbigiousFields } from '../types'
import {
  IdentityId,
  defineNodeResolver,
  idReference,
  prefixId,
  resolveDateToIso,
  resolveImageUrls,
  setIfEmpty,
} from '../utils'
import type { WebPage } from '../defineWebPage'
import { WebPageId } from '../defineWebPage'
import type { Organization } from '../defineOrganization'
import type { Person } from '../definePerson'
import type { ImageObject } from '../defineImage'
import { defineImage } from '../defineImage'

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
  description?: string
  /**
   * A reference-by-ID to the WebPage node.
   */
  isPartOf?: IdReference
  /**
   * The time at which the article was originally published, in ISO 8601 format; e.g., 2015-10-31T16:10:29+00:00.
   */
  datePublished: string|Date
  /**
   * The time at which the article was last modified, in ISO 8601 format; e.g., 2015-10-31T16:10:29+00:00.
   */
  dateModified?: string|Date
  /**
   * A reference-by-ID to the author of the article.
   */
  author: Arrayable<IdReference|Person|Organization>
  /**
   * A reference-by-ID to the publisher of the article.
   */
  publisher: IdReference|Person|Organization
  /**
   * An image object (or array of all images in the article content), referenced by ID.
   * - Must be at least 696 pixels wide.
   * - Must be of the following formats+file extensions: .jpg, .png, .gif ,or .webp.
   */
  image: Arrayable<IdReference|ImageObject|string>
  /**
   * An array of all videos in the article content, referenced by ID.
   */
  video?: IdReference[]
  /**
   * An array of references by ID to comment pieces.
   */
  comment?: IdReference[]
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
  copyrightHolder?: IdReference
}

export const ArticleId = '#article'

export type ArticleOptional = '@id'|'@type'|'headline'|'publisher'|'image'|'author'
/**
 * Describes an Article on a WebPage.
 */
export function defineArticle(articleInput: WithAmbigiousFields<Article, ArticleOptional>) {
  return defineNodeResolver<Article, ArticleOptional>(articleInput, {
    defaults({ canonicalUrl, currentRouteMeta, options }) {
      return {
        '@type': 'Article',
        '@id': prefixId(canonicalUrl, ArticleId),
        'headline': currentRouteMeta.title as string,
        'description': currentRouteMeta.description as string,
        'dateModified': currentRouteMeta.dateModified as string,
        'datePublished': currentRouteMeta.datePublished as string,
        'inLanguage': options.defaultLanguage,
        'image': currentRouteMeta.image as string,
      }
    },
    resolve(article, { canonicalHost }) {
      resolveDateToIso(article, 'dateModified')
      resolveDateToIso(article, 'datePublished')
      // resolve @type to an array
      if (typeof article['@type'] === 'string' && article['@type'] !== 'Article') {
        article['@type'] = [
          'Article',
          article['@type'],
        ]
      }
      article.image = resolveImageUrls(canonicalHost, article.image)
      return article
    },
    mergeRelations(article, { findNode, addNode, canonicalUrl }) {
      const webPage = findNode<WebPage>(WebPageId)
      const identity = findNode<Organization|Person>(IdentityId)

      if (webPage && !webPage.primaryImageOfPage && article.image) {
        const firstImage = Array.isArray(article.image) ? article.image[0] : article.image

        if (typeof firstImage === 'string') {
          setIfEmpty(article, 'thumbnailUrl', firstImage)

          const image = defineImage({
            '@id': prefixId(canonicalUrl, '#primaryimage'),
            'url': firstImage,
          }).resolve()
          addNode(image)
          setIfEmpty(webPage, 'primaryImageOfPage', idReference(image))
          if (Array.isArray(article.image))
            article.image[0] = idReference(image)
          else
            article.image = idReference(image)
        }
        else if (firstImage['@id']) {
          setIfEmpty(webPage, 'primaryImageOfPage', idReference(firstImage as Thing))
        }
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
        setIfEmpty(webPage, 'author', article.author)
      }
      return article
    },
  })
}
