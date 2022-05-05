import type { DeepPartial } from 'utility-types'
import { hash } from 'ohash'
import type { Arrayable, IdReference, SchemaNodeInput, Thing } from '../../types'
import {
  IdentityId,
  defineSchemaResolver,
  idReference,
  prefixId,
  resolveId,
  resolveRouteMeta,
  setIfEmpty,
} from '../../utils'
import type { WebPage } from '../WebPage'
import { PrimaryWebPageId } from '../WebPage'
import type { Person } from '../Person'
import type { Organization } from '../Organization'
import type { RelatedReviewInput } from '../Review'
import { resolveReviews } from '../Review'
import type { ImageInput } from '../Image'
import type { OfferInput } from '../Offer'
import { resolveOffer } from '../Offer'
import type { AggregateRatingInput } from '../AggregateRating'
import { resolveAggregateRating } from '../AggregateRating'
import type { AggregateOfferInput } from '../AggregateOffer'
import { resolveAggregateOffer } from '../AggregateOffer'
import { defineSchemaOrgComponent } from '../../components/defineSchemaOrgComponent'

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
  brand?: Organization | IdReference
  /**
   * A reference to an Organization piece which represents the WebSite.
   */
  seller?: Organization | IdReference
  /**
   * A text description of the product.
   */
  description?: string
  /**
   * An array of references-by-id to one or more Review pieces.
   */
  review?: Arrayable<RelatedReviewInput>
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
  manufacturer?: Organization | IdReference
}

export const defineProductPartial = <K>(input?: DeepPartial<Product> & K) =>
  // hacky way for users to get around strict typing when using custom schema, route meta or augmentation
  defineProduct(input as Product)

export const ProductId = '#product'

export function defineProduct<T extends SchemaNodeInput<Product>>(input: T) {
  return defineSchemaResolver<T, Product>(input, {
    defaults({ canonicalUrl, meta }) {
      const defaults: Partial<Product> = {
        '@type': 'Product',
        '@id': prefixId(canonicalUrl, ProductId),
      }
      resolveRouteMeta(defaults, meta, [
        'name',
        'description',
        'image',
      ])
      return defaults
    },
    resolve(product, ctx) {
      resolveId(product, ctx.canonicalUrl)
      // provide a default sku
      setIfEmpty(product, 'sku', hash(product.name))
      // @todo fix types
      if (product.aggregateOffer)
        product.aggregateOffer = resolveAggregateOffer(ctx, product.aggregateOffer) as AggregateOfferInput
      if (product.aggregateRating)
        product.aggregateRating = resolveAggregateRating(ctx, product.aggregateRating) as AggregateRatingInput
      if (product.offers)
        product.offers = resolveOffer(ctx, product.offers) as OfferInput[]
      if (product.review)
        product.review = resolveReviews(ctx, product.review)
      return product
    },
    rootNodeResolve(product, { findNode }) {
      const webPage = findNode<WebPage>(PrimaryWebPageId)
      const identity = findNode<Person | Organization>(IdentityId)

      if (identity)
        setIfEmpty(product, 'brand', idReference(identity))

      if (webPage)
        setIfEmpty(product, 'mainEntityOfPage', idReference(webPage))

      return product
    },
  })
}

export const SchemaOrgProduct = defineSchemaOrgComponent('SchemaOrgProduct', defineProduct)
