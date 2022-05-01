import { hash } from 'ohash'
import type { DeepPartial } from 'utility-types'
import type { SchemaNodeInput, Thing } from '../types'
import {
  callAsPartial,
  defineNodeResolver,
  idReference,
  prefixId,
  resolveId,
  resolveWithBaseUrl,
  setIfEmpty,
} from '../utils'
import type { WebPage } from '../defineWebPage'
import type { Article } from '../defineArticle'

export interface ImageObject extends Thing {
  '@type': 'ImageObject'
  /**
   * The URL of the image file (e.g., /images/cat.jpg).
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

export const defineImagePartial = <K>(input?: DeepPartial<ImageObject> & K) =>
  // hacky way for users to get around strict typing when using custom schema, route meta or augmentation
  callAsPartial(defineImage, input)

/**
 * Describes an individual image (usually in the context of an embedded media object).
 */
export function defineImage<T extends SchemaNodeInput<ImageObject>>(input: T) {
  return defineNodeResolver<T, ImageObject>(input, {
    defaults({ options }) {
      return {
        '@type': 'ImageObject',
        'inLanguage': options.defaultLanguage,
      }
    },
    resolve(image, { options, canonicalHost }) {
      image.url = resolveWithBaseUrl(canonicalHost, image.url)
      setIfEmpty(image, '@id', prefixId(canonicalHost, `#/schema/image/${hash(image.url)}`))
      resolveId(image, canonicalHost)
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

export function definePrimaryImage(image: SchemaNodeInput<ImageObject>) {
  const resolver = defineImage(image)

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
