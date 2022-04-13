import { defu } from 'defu'
import type { OptionalMeta, Thing } from '../types'

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

export function defineImage(image: OptionalMeta<ImageObject>) {

  if (!image.contentUrl)
    image.contentUrl = image.url
  // if (image['@id']?.startsWith('#'))
  //   image['@id'] = resolveCanonicalUrl() + image['@id']

  return defu(image, {
    '@type': 'ImageObject',
  }) as ImageObject
}
