import { hash } from 'ohash'
import type { DeepPartial } from 'utility-types'
import type { Arrayable, DefaultOptionalKeys, IdReference, SchemaNodeInput, SchemaOrgContext, Thing } from '../../types'
import {
  defineSchemaResolver,
  prefixId,
  resolveArrayable, resolveDateToIso, resolveSchemaResolver,
} from '../../utils'
import { defineSchemaOrgComponent } from '../../components/defineSchemaOrgComponent'

export interface Offer extends Thing {
  '@type': 'Offer'
  /**
   * A schema.org URL representing a schema itemAvailability value (e.g., https://schema.org/OutOfStock).
   */
  availability: string
  /**
   * The price, omitting any currency symbols, and using '.' to indicate a decimal place.
   */
  price: number
  /**
   * The currency used to describe the product price, in three-letter ISO 4217 format.
   */
  priceCurrency: string
  /**
   * @todo A PriceSpecification object, including a valueAddedTaxIncluded property (of either true or false).
   */
  priceSpecification?: unknown
  /**
   * The date after which the price is no longer available.
   */
  priceValidUntil?: string | Date
}

export type OfferInput = SchemaNodeInput<Offer, DefaultOptionalKeys | 'availability' | 'priceCurrency'> | IdReference

/**
 * Describes an Article on a WebPage.
 */
export const defineOfferPartial = <K>(input?: DeepPartial<Offer> & K) =>
  // hacky way for users to get around strict typing when using custom schema, route meta or augmentation
  defineOffer(input as Offer)

export function defineOffer<T extends SchemaNodeInput<Offer, DefaultOptionalKeys | 'availability' | 'priceCurrency'>>(input: T) {
  return defineSchemaResolver<T, Offer>(input, {
    defaults(ctx) {
      return {
        '@type': 'Offer',
        '@id': prefixId(ctx.canonicalHost, `#/schema/offer/${hash(input)}`),
        'priceCurrency': ctx.options.defaultCurrency,
        'availability': 'https://schema.org/InStock',
        'url': ctx.canonicalUrl,
        'priceValidUntil': new Date(Date.UTC(new Date().getFullYear() + 1, 12, -1, 0, 0, 0)),
      }
    },
    resolve(node) {
      if (node.priceValidUntil)
        node.priceValidUntil = resolveDateToIso(node.priceValidUntil)
      return node
    },
  })
}

export function resolveOffer(ctx: SchemaOrgContext, input: Arrayable<OfferInput>) {
  return resolveArrayable<OfferInput, Offer>(input, input => resolveSchemaResolver(ctx, defineOffer(input)))
}

export const SchemaOrgOffer = defineSchemaOrgComponent('Offer', defineOffer)
