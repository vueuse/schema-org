import type { IdReference, OptionalMeta, Thing } from '../types'
import type { NodeResolver } from '../utils'
import { IdentityId, defineNodeResolver, idReference, prefixId, setIfEmpty } from '../utils'
import { WebPageId } from '../defineWebPage'
import type { Person } from '../definePerson'
import type { Organization } from '../defineOrganization'
import type { ImageObject } from '../defineImage'
import type { AggregateRating, WithAggregateRatingInput } from './withAggregateRating'
import { withAggregateRating } from './withAggregateRating'
import type { AggregateOffer, WithAggregateOfferInput } from './withAggregateOffer'
import { withAggregateOffer } from './withAggregateOffer'
import type { WithReviewsInput } from './withReviews'
import { withReviews } from './withReviews'
import type { Offer, WithOfferInput, WithOffersInput } from './withOffers'
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
  image?: ImageObject|ImageObject[]|IdReference|IdReference[]
  /**
   *  An array of references-by-ID to one or more Offer or aggregateOffer pieces.
   */
  offers?: Offer[]|IdReference[]
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
  review?: string
  /**
   * A merchant-specific identifier for the Product.
   */
  sku?: string
  /**
   * An AggregateRating object.
   */
  aggregateRating?: IdReference|AggregateRating
  /**
   * An AggregateOffer object.
   */
  aggregateOffer?: IdReference|AggregateOffer
  /**
   * A reference to an Organization piece, representing the brand which produces the Product.
   */
  manufacturer?: Organization|IdReference
}

export const ProductId = '#product'

export type ProductNodeResolver = NodeResolver<Product> & {
  withAggregateRating: (aggregateRatingInput: WithAggregateRatingInput) => ProductNodeResolver
  withOffer: (offerInput: WithOfferInput) => ProductNodeResolver
  withOffers: (offerInput: WithOffersInput) => ProductNodeResolver
  withAggregateOffer: (aggregateOfferInput: WithAggregateOfferInput) => ProductNodeResolver
  withReviews: (reviewsInput: WithReviewsInput) => ProductNodeResolver
}

/**
 * Describes an Article on a WebPage.
 */
export function defineProduct(product: OptionalMeta<Product>): ProductNodeResolver {
  const resolver = defineNodeResolver<Product>(product, {
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
    withOffer: (offerInput: WithOfferInput) => withOffers(productResolver)([offerInput]),
    withOffers: (offerInput: WithOffersInput) => withOffers(productResolver)(offerInput),
    withAggregateOffer: (aggregateOfferInput: WithAggregateOfferInput) => withAggregateOffer(productResolver)(aggregateOfferInput),
    withReviews: (reviewsInput: WithReviewsInput) => withReviews(productResolver)(reviewsInput),
  }

  return productResolver
}
