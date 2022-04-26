import type { DeepPartial } from 'utility-types'
import type { Arrayable, IdReference, SchemaNodeInput, Thing } from '../types'
import { IdentityId, defineNodeResolver, idReference, prefixId, resolveId, resolveRouteMeta, setIfEmpty } from '../utils'
import { PrimaryWebPageId } from '../defineWebPage'
import type { Person } from '../definePerson'
import type { Organization } from '../defineOrganization'
import type { OfferInput } from '../shared/resolveOffers'
import type { AggregateRatingInput } from '../shared/resolveAggregateRating'
import type { AggregateOfferInput } from '../shared/resolveAggregateOffer'
import { resolveAggregateOffer } from '../shared/resolveAggregateOffer'
import { resolveAggregateRating } from '../shared/resolveAggregateRating'
import { resolveOffers } from '../shared/resolveOffers'
import type { ReviewInput } from '../shared/resolveReviews'
import { resolveReviews } from '../shared/resolveReviews'
import type { ImageInput } from '../shared/resolveImages'

/**
 * Any offered product or service.
 * For example: a pair of shoes; a concert ticket; the rental of a car;
 * a haircut; or an episode of a TV show streamed online.
 */
export interface Product extends Thing {
  /**
   * The name of the product.
   */
  name: string
  /**
   * A reference-by-ID to one or more imageObject's which represent the product.
   * - Must be at least 696 pixels wide.
   * - Must be of the following formats+file extensions: .jpg, .png, .gif ,or .webp.
   */
  image: Arrayable<ImageInput>
  /**
   *  An array of references-by-ID to one or more Offer or aggregateOffer pieces.
   */
  offers?: OfferInput[]
  /**
   *  A reference to an Organization piece, representing brand associated with the Product.
   */
  brand?: Organization|IdReference
  /**
   * A reference to an Organization piece which represents the WebSite.
   */
  seller?: Organization|IdReference
  /**
   * A text description of the product.
   */
  description?: string
  /**
   * An array of references-by-id to one or more Review pieces.
   */
  review?: Arrayable<ReviewInput>
  /**
   * A merchant-specific identifier for the Product.
   */
  sku?: string
  /**
   * An AggregateRating object.
   */
  aggregateRating?: AggregateRatingInput
  /**
   * An AggregateOffer object.
   */
  aggregateOffer?: AggregateOfferInput
  /**
   * A reference to an Organization piece, representing the brand which produces the Product.
   */
  manufacturer?: Organization|IdReference
}

export function defineProductPartial<K>(input: DeepPartial<Product> & K) {
  // hacky way for users to get around strict typing when using custom schema, route meta or augmentation
  return defineProduct(input as SchemaNodeInput<Product>)
}

export const ProductId = '#product'

export function defineProduct<T extends SchemaNodeInput<Product>>(input: T) {
  return defineNodeResolver<T, Product>(input, {
    defaults({ canonicalUrl, currentRouteMeta }) {
      const defaults: Partial<Product> = {
        '@type': 'Product',
        '@id': prefixId(canonicalUrl, ProductId),
      }
      resolveRouteMeta(defaults, currentRouteMeta, [
        'name',
        'description',
        'image',
      ])
      return defaults
    },
    resolve(product, { canonicalUrl }) {
      resolveId(product, canonicalUrl)
      // @todo fix types
      if (product.aggregateOffer)
        product.aggregateOffer = resolveAggregateOffer(product.aggregateOffer) as AggregateOfferInput
      if (product.aggregateRating)
        product.aggregateRating = resolveAggregateRating(product.aggregateRating) as AggregateRatingInput
      if (product.offers)
        product.offers = resolveOffers(product.offers) as OfferInput[]
      if (product.review)
        product.review = resolveReviews(product.review) as Arrayable<ReviewInput>
      return product
    },
    mergeRelations(product, { findNode }) {
      const webPage = findNode(PrimaryWebPageId)
      const identity = findNode<Person|Organization>(IdentityId)

      if (identity)
        setIfEmpty(product, 'brand', idReference(identity))

      if (webPage)
        setIfEmpty(product, 'mainEntityOfPage', idReference(webPage))

      return product
    },
  })
}
