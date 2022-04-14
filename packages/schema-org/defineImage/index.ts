import type { OptionalMeta, Thing } from '../types'
import { defineNodeResolverSchema, setIfEmpty } from '../utils'

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
    defaults: {
      '@type': 'ImageObject',
      // must provide an id
    },
    resolve(image, { defaultLanguage }) {
      setIfEmpty(image, 'contentUrl', image.url)
      // image height and width are required to render
      if (image.height && !image.width)
        delete image.height
      if (image.width && !image.height)
        delete image.width
      // set the caption language if we're able to
      if (image.caption && !image.inLanguage && defaultLanguage)
        image.inLanguage = defaultLanguage
      return image
    },
  })
}
