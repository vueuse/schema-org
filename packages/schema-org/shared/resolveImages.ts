import type { Arrayable, IdReference, SchemaNode, SchemaNodeInput } from '../types'
import { idReference, prefixId, resolver, setIfEmpty } from '../utils'
import type { ImageObject } from '../defineImage'
import { defineImage } from '../defineImage'
import type { WebPage } from '../defineWebPage'
import { PrimaryWebPageId } from '../defineWebPage'

export type SingleImageInput = SchemaNodeInput<ImageObject>|IdReference|string
export type ImageInput = Arrayable<SchemaNodeInput<ImageObject>|IdReference|string>

export function resolveImages<T extends SchemaNode>(node: T, field: keyof T) {
  let hasPrimaryImage = false
  if (node[field]) {
    // @ts-expect-error untyped
    node[field] = resolver(node[field], (imageInput: SchemaNodeInput<ImageObject>|string, { addNode, findNode, canonicalUrl }) => {
      if (findNode('#primaryimage'))
        hasPrimaryImage = true

      if (typeof imageInput === 'string') {
        imageInput = {
          url: imageInput,
        }
      }
      const imageResolver = defineImage(imageInput)
      const image = imageResolver.resolve()

      if (!hasPrimaryImage) {
        const webPage = findNode<WebPage>(PrimaryWebPageId)
        if (webPage) {
          image['@id'] = prefixId(canonicalUrl, '#primaryimage')
          setIfEmpty(webPage, 'primaryImageOfPage', idReference(image))
        }
        hasPrimaryImage = true
      }

      addNode(image)
      return idReference(imageResolver.resolveId())
    })
  }
}
