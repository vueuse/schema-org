import { hash } from 'ohash'
import type { DeepPartial } from 'utility-types'
import type { Arrayable, IdReference, SchemaNodeInput, SchemaOrgContext, Thing } from '../../types'
import {
  defineSchemaResolver,
  prefixId,
  resolveArrayable, resolveSchemaResolver,
} from '../../utils'
import { defineSchemaOrgComponent } from '../../components/defineSchemaOrgComponent'

export interface PostalAddress extends Thing {
  /**
   * The building number and street (e.g., 123 fake road ).
   */
  streetAddress: string
  /**
   * The postal code.
   */
  postalCode: string
  /**
   * The two-digit country-code representing the country (e.g., US ).
   */
  addressCountry: string
  /**
   * The town, city or equivalent.
   */
  addressLocality?: string
  /**
   * The region or district.
   */
  addressRegion?: string
  /**
   * A PO box number.
   */
  postOfficeBoxNumber?: string
}

export type RelatedAddressInput = SchemaNodeInput<PostalAddress> | IdReference

/**
 * Describes an Article on a WebPage.
 */
export const defineAddressPartial = <K>(input?: DeepPartial<PostalAddress> & K) =>
  // hacky way for users to get around strict typing when using custom schema, route meta or augmentation
  defineAddress(input as PostalAddress)

export function defineAddress<T extends SchemaNodeInput<PostalAddress>>(input: T) {
  return defineSchemaResolver<T, PostalAddress>(input, {
    defaults(ctx) {
      return {
        '@type': 'PostalAddress',
        '@id': prefixId(ctx.canonicalHost, `#/schema/address/${hash(input)}`),
      }
    },
  })
}

export function resolveAddress(ctx: SchemaOrgContext, input: Arrayable<RelatedAddressInput>) {
  return resolveArrayable<RelatedAddressInput, PostalAddress>(input, input => resolveSchemaResolver(ctx, defineAddress(input)))
}

export const SchemaOrgAddress = defineSchemaOrgComponent('SchemaOrgAddress', defineAddress)
