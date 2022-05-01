import type { DeepPartial } from 'utility-types'
import type { SchemaNodeInput, Thing } from '../types'
import {
  IdentityId,
  callAsPartial,
  defineNodeResolver,
  prefixId,
  resolveId, resolveType,
} from '../utils'
import type { AddressInput } from '../shared/resolveAddress'
import { resolveAddress } from '../shared/resolveAddress'
import type { ImageInput, SingleImageInput } from '../shared/resolveImages'
import { resolveImages } from '../shared/resolveImages'

/**
 * An organization such as a school, NGO, corporation, club, etc.
 */
export interface Organization extends Thing {
  /**
   * A reference-by-ID to an image of the organization's logo.
   *
   * - The image must be 112x112px, at a minimum.
   * - Make sure the image looks how you intend it to look on a purely white background
   * (for example, if the logo is mostly white or gray,
   * it may not look how you want it to look when displayed on a white background).
   */
  logo: SingleImageInput
  /**
   * The site's home URL.
   */
  url?: string
  /**
   * The name of the Organization.
   */
  name: string
  /**
   * An array of URLs representing declared social/authoritative profiles of the organization
   * (e.g., a Wikipedia page, or Facebook profile).
   */
  sameAs?: string[]
  /**
   * An array of images which represent the organization (including the logo ), referenced by ID.
   */
  image?: ImageInput
  /**
   * A reference-by-ID to an PostalAddress piece.
   */
  address?: AddressInput
}

export const defineOrganizationPartial = <K>(input?: DeepPartial<Organization> & K) =>
  // hacky way for users to get around strict typing when using custom schema, route meta or augmentation
  callAsPartial(defineOrganization, input)

/**
 * Describes an organization (a company, business or institution).
 * Most commonly used to identify the publisher of a WebSite.
 *
 * May be transformed into a more specific type
 * (such as Corporation or LocalBusiness) if the required conditions are met.
 */
export function defineOrganization<T extends SchemaNodeInput<Organization>>(input: T) {
  return defineNodeResolver<T, Organization>(input, {
    required: [
      'name',
      'logo',
    ],
    defaults({ canonicalHost }) {
      return {
        '@type': 'Organization',
        '@id': prefixId(canonicalHost, IdentityId),
        'url': canonicalHost,
      }
    },
    resolve(node, { canonicalHost }) {
      resolveId(node, canonicalHost)
      if (node['@type'])
        node['@type'] = resolveType(node['@type'], 'Organization')
      if (node.address)
        node.address = resolveAddress(node.address) as AddressInput
      if (node.logo) {
        node.logo = resolveImages(node.logo, {
          mergeWith: {
            '@id': prefixId(canonicalHost, '#logo'),
            'caption': node.name,
          },
        }) as SingleImageInput
      }
      return node
    },
  })
}
