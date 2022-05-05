import { hash } from 'ohash'
import type { DeepPartial } from 'utility-types'
import type { Arrayable, IdReference, SchemaNodeInput, SchemaOrgContext, Thing } from '../../types'
import {
  defineSchemaResolver,
  prefixId,
  resolveArrayable, resolveSchemaResolver, setIfEmpty,
} from '../../utils'
import { defineSchemaOrgComponent } from '../../components/defineSchemaOrgComponent'
import type { OfferInput } from '../Offer'
import { resolveOffer } from '../Offer'

export interface AggregateOffer extends Thing {
  '@type': 'AggregateOffer'
  /**
   * The lowest price of the group, omitting any currency symbols, and using '.' to indicate a decimal place.
   */
  lowPrice: number
  /**
   *  The highest price of the group, omitting any currency symbols, and using '.' to indicate a decimal place.
   */
  highPrice: number
  /**
   * The currency used to describe the product price, in a three-letter ISO 4217 format.
   */
  priceCurrency: string
  /**
   * The number of offers in the group
   */
  offerCount: number
  /**
   * An array of Offer pieces, referenced by ID.
   */
  offers: OfferInput[]
}

export type AggregateOfferInput = SchemaNodeInput<AggregateOffer, '@type' | 'priceCurrency' | 'offerCount'> | IdReference

/**
 * Describes an Article on a WebPage.
 */
export const defineAggregateOfferPartial = <K>(input?: DeepPartial<AggregateOffer> & K) =>
  // hacky way for users to get around strict typing when using custom schema, route meta or augmentation
  defineAggregateOffer(input as AggregateOffer)

export function defineAggregateOffer<T extends SchemaNodeInput<AggregateOffer>>(input: T) {
  return defineSchemaResolver<T, AggregateOffer>(input, {
    defaults(ctx) {
      return {
        '@type': 'AggregateOffer',
        '@id': prefixId(ctx.canonicalHost, `#/schema/aggregate-offer/${hash(input)}`),
      }
    },
    resolve(node, ctx) {
      if (node.offers) {
        // @todo fix type
        node.offers = resolveOffer(ctx, node.offers) as OfferInput[]
      }
      setIfEmpty(node, 'offerCount', Array.isArray(node.offers) ? node.offers.length : 1)
      return node
    },
  })
}

export function resolveAggregateOffer(ctx: SchemaOrgContext, input: Arrayable<AggregateOfferInput>) {
  return resolveArrayable<AggregateOfferInput, AggregateOffer>(input, input => resolveSchemaResolver(ctx, defineAggregateOffer(input)))
}

export const SchemaOrgAggregateOffer = defineSchemaOrgComponent('AggregateOffer', defineAggregateOffer)
