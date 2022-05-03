import type { WebPage } from '@vueuse/schema-org'
import { PrimaryWebPageId } from '@vueuse/schema-org'
import type { Arrayable, IdReference, SchemaNodeInput } from '../types'
import type { ResolverOptions } from '../utils'
import { idReference, prefixId, resolveArrayable, setIfEmpty } from '../utils'
import type { ImageObject } from '../defineImage'
import { defineImage } from '../defineImage'
import type { SchemaOrgContext } from '../createSchemaOrg'

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

function resolveImage(ctx: SchemaOrgContext, options: ResolveImagesOptions = {}) {
  let hasPrimaryImage = false
  return (input: ImageInput) => {
    const { addNode, findNode, canonicalUrl } = ctx
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
    const image = imageResolver.resolve(ctx)

    if (options.resolvePrimaryImage && !hasPrimaryImage) {
      const webPage = findNode<WebPage>(PrimaryWebPageId)
      if (webPage) {
        image['@id'] = prefixId(canonicalUrl, '#primaryimage')
        setIfEmpty(webPage, 'primaryImageOfPage', idReference(image))
      }
      hasPrimaryImage = true
    }

    if (options.asRootNodes) {
      addNode(image, ctx)
      return idReference(image['@id'])
    }
    return image
  }
}

/**
 * Describes an offer for a Product (typically prices, stock availability, etc).
 */
export function resolveImages(client: SchemaOrgContext, input: Arrayable<ImageInput>, options: ResolveImagesOptions = {}) {
  return resolveArrayable<ImageInput, ImageObject>(input, resolveImage(client, options), options)
}
