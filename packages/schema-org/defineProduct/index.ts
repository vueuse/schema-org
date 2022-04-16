import type { IdReference, OptionalMeta, Thing } from '../types'
import {defineNodeResolverSchema, IdentityId, idReference, prefixId, setIfEmpty} from '../utils'
import { WebPageId } from '../defineWebPage'
import {Person} from "../definePerson";
import {Organization} from "../defineOrganization";

export interface Product extends Thing {
  /**
   * The name of the product.
   */
  name: string
  /**
   * A reference-by-ID to one or more imageObject s which represent the product.
   * - Must be at least 696 pixels wide.
   * - Must be of the following formats+file extensions: .jpg, .png, .gif ,or .webp.
   */
  image?: IdReference|IdReference[]

  /**
   *  An array of references-by-ID to one or more Offer or aggregateOffer pieces.
   */
  offers?: IdReference[] // @todo
  /**
   *  A reference to an Organization piece, representing brand associated with the Product.
   */
  brand?: IdReference
  /**
   * A reference to an Organization piece which represents the WebSite.
   */
  seller?: IdReference
  /**
   * A text description of the product.
   */
  description?: string
  /**
   * An array of references-by-id to one or more Review pieces.
   */
  review?: string
  /**
   * A merchant-specific identifier for the Product.
   */
  sku?: string
  /**
   * An AggregateRating object.
   */
  aggregateRating?: unknown // @todo
  /**
   * A reference to an Organization piece, representing the brand which produces the Product.
   */
  manufacturer?: IdReference
}

export const ProductId = '#product'

/**
 * Describes an Article on a WebPage.
 */
export function defineProduct(product: OptionalMeta<Product>) {
  return defineNodeResolverSchema<Product>(product, {
    defaults({ canonicalUrl, currentRouteMeta }) {
      return {
        '@type': 'Product',
        '@id': prefixId(canonicalUrl, ProductId),
        'description': currentRouteMeta.description as string,
      }
    },

    mergeRelations(product, { findNode }) {
      const webPage = findNode(WebPageId)
      const identity = findNode<Person|Organization>(IdentityId)

      if (identity)
        setIfEmpty(product, 'brand', idReference(identity))

      if (webPage)
        setIfEmpty(product, 'mainEntityOfPage', idReference(webPage))

      return product
    },
  })
}
