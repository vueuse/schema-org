import type { OptionalMeta, Thing } from '../types'
import { defineNodeResolverSchema, idReference, prefixId, setIfEmpty } from '../utils'
import type { WebPage } from '../defineWebPage'
import type { Article } from '../defineArticle'

export interface ImageObject extends Thing {
  /**
   * The fully-qualified, absolute URL of the image file (e.g., https://www.example.com/images/cat.jpg).
   */
  url: string
  /**
   * The fully-qualified, absolute URL of the image file (e.g., https://www.example.com/images/cat.jpg).
   * Note: The contentUrl and url properties are intentionally duplicated.
   */
  contentUrl?: string
  /**
   * A text string describing the image.
   * - Fall back to the image alt attribute if no specific caption field exists or is defined.
   */
  caption?: string
  /**
   * The height of the image in pixels.
   * - Must be used with width.
   */
  height?: number
  /**
   * The width of the image in pixels.
   * - Must be used with height.
   */
  width?: number
  /**
   * The language code for the textual content; e.g., en-GB.
   * - Only needed when providing a caption.
   */
  inLanguage?: string
}

/**
 * Describes an individual image (usually in the context of an embedded media object).
 */
export function defineImage(image: OptionalMeta<ImageObject, '@type'>) {
  return defineNodeResolverSchema(image, {
    defaults({ options }) {
      return {
        '@type': 'ImageObject',
        'inLanguage': options.defaultLanguage,
      }
    },
    resolve(image, { options }) {
      setIfEmpty(image, 'contentUrl', image.url)
      // image height and width are required to render
      if (image.height && !image.width)
        delete image.height
      if (image.width && !image.height)
        delete image.width
      // set the caption language if we're able to
      if (image.caption && options.defaultLanguage)
        setIfEmpty(image, 'inLanguage', options.defaultLanguage)
      return image
    },
  })
}

export function definePrimaryImage(image: OptionalMeta<ImageObject>) {
  const resolver = defineImage({
    '@id': '#primaryimage',
    ...image,
  })

  resolver.definition.defaults = ({ canonicalUrl, options }) => {
    return {
      '@type': 'ImageObject',
      '@id': prefixId(canonicalUrl, '#primaryimage'),
      'inLanguage': options.defaultLanguage,
    }
  }
  resolver.definition.mergeRelations = (image, { findNode }) => {
    const webpage = findNode<WebPage>('#webpage')
    const article = findNode<Article>('#article')

    if (webpage)
      setIfEmpty(webpage, 'primaryImageOfPage', idReference(image))

    if (article)
      setIfEmpty(article, 'image', idReference(image))
  }
  return resolver
}
