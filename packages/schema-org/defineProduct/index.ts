import type { IdReference, OptionalMeta, Thing } from '../types'
import {IdentityId, defineNodeResolverSchema, idReference, prefixId, setIfEmpty, NodeResolver} from '../utils'
import { WebPageId } from '../defineWebPage'
import type { Person } from '../definePerson'
import type { Organization } from '../defineOrganization'
import type { AggregateRating, WithAggregateRatingInput } from './withAggregateRating'
import { withAggregateRating } from './withAggregateRating'
import type { WithAggregateOfferInput } from './withAggregateOffer'
import { withAggregateOffer } from './withAggregateOffer'
import type { WithReviewsInput } from './withReviews'
import { withReviews } from './withReviews'
import type { WithOffersInput } from './withOffers'
import { withOffers } from './withOffers'

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
  aggregateRating?: AggregateRating
  /**
   * A reference to an Organization piece, representing the brand which produces the Product.
   */
  manufacturer?: IdReference
}

export const ProductId = '#product'

export type DefineProductReturn = NodeResolver<Product> & {
  withAggregateRating: (aggregateRatingInput: WithAggregateRatingInput) => DefineProductReturn
  withOffers: (offerInput: WithOffersInput) => DefineProductReturn
  withAggregateOffer: (aggregateOfferInput: WithAggregateOfferInput) => DefineProductReturn
  withReviews: (reviewsInput: WithReviewsInput) => DefineProductReturn
}

/**
 * Describes an Article on a WebPage.
 */
export function defineProduct(product: OptionalMeta<Product>): DefineProductReturn {
  const resolver = defineNodeResolverSchema<Product>(product, {
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

  const productResolver = {
    ...resolver,
    withAggregateRating: (aggregateRatingInput: WithAggregateRatingInput) => withAggregateRating(productResolver)(aggregateRatingInput),
    withOffers: (offerInput: WithOffersInput) => withOffers(productResolver)(offerInput),
    withAggregateOffer: (aggregateOfferInput: WithAggregateOfferInput) => withAggregateOffer(productResolver)(aggregateOfferInput),
    withReviews: (reviewsInput: WithReviewsInput) => withReviews(productResolver)(reviewsInput),
  }

  return productResolver
}
