import type { Arrayable, IdReference, SchemaNodeInput } from '../types'
import type { ResolverOptions } from '../utils'
import { idReference, prefixId, resolver, setIfEmpty } from '../utils'
import type { ImageObject } from '../defineImage'
import { defineImage } from '../defineImage'
import type { WebPage } from '../defineWebPage'
import { PrimaryWebPageId } from '../defineWebPage'

export type SingleImageInput = SchemaNodeInput<ImageObject> | IdReference | string
export type ImageInput = Arrayable<SchemaNodeInput<ImageObject> | IdReference | string>

export interface ResolveImagesOptions extends ResolverOptions {
  /**
   * Resolve a primary image from the image list if it's not provided.
   */
  resolvePrimaryImage?: boolean
  /**
   * Whether the image nodes registered should be moved to the root schema graph or kept inline.
   */
  asRootNodes?: boolean
  /**
   * Custom data to merge with the entries
   */
  mergeWith?: Partial<ImageObject>
  /**
   * Return single images as an object
   */
  array?: boolean
}

/**
 * Describes an offer for a Product (typically prices, stock availability, etc).
 */
export function resolveImages(input: Arrayable<ImageInput>, options: ResolveImagesOptions = {}) {
  let hasPrimaryImage = false
  return resolver<ImageInput, ImageObject>(
    input,
    (input, { findNode, canonicalUrl, addNode },
    ) => {
      if (findNode('#primaryimage'))
        hasPrimaryImage = true

      if (typeof input === 'string') {
        input = {
          url: input,
        }
      }
      const imageInput = {
        ...input,
        ...(options.mergeWith ?? {}),
      } as SchemaNodeInput<ImageObject>
      const imageResolver = defineImage(imageInput)
      const image = imageResolver.resolve()

      if (options.resolvePrimaryImage && !hasPrimaryImage) {
        const webPage = findNode<WebPage>(PrimaryWebPageId)
        if (webPage) {
          image['@id'] = prefixId(canonicalUrl, '#primaryimage')
          setIfEmpty(webPage, 'primaryImageOfPage', idReference(image))
        }
        hasPrimaryImage = true
      }

      if (options.asRootNodes) {
        addNode(image)
        return idReference(imageResolver.resolveId())
      }
      return image
    })
}
