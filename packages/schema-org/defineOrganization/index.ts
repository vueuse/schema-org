import type { SchemaNodeInput, Thing } from '../types'
import type { NodeResolver } from '../utils'
import {
  IdentityId,
  defineNodeResolver,
  ensureBase,
  idReference,
  prefixId,
  resolveType,
  setIfEmpty, resolveId,
} from '../utils'
import { defineImage } from '../defineImage'
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
  url: string
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

export type OrganizationOptional = '@id'|'@type'|'url'
export type DefineOrganizationInput = SchemaNodeInput<Organization, OrganizationOptional>
export type OrganizationNodeResolver = NodeResolver<Organization, OrganizationOptional>

/**
 * Describes an organization (a company, business or institution).
 * Most commonly used to identify the publisher of a WebSite.
 *
 * May be transformed into a more specific type
 * (such as Corporation or LocalBusiness) if the required conditions are met.
 */
export function defineOrganization(organization: DefineOrganizationInput): OrganizationNodeResolver {
  return defineNodeResolver<Organization, OrganizationOptional>(organization, {
    defaults({ canonicalHost }) {
      return {
        '@type': 'Organization',
        '@id': prefixId(canonicalHost, IdentityId),
        'url': canonicalHost,
      }
    },
    resolve(organization, { canonicalHost }) {
      resolveId(organization, canonicalHost)
      resolveType(organization, 'Organization')
      resolveAddress(organization, 'address')
      resolveImages(organization, 'logo')
      return organization
    },
    mergeRelations(organization, { canonicalHost }) {
      // move logo to root schema
      if (typeof organization.logo === 'string') {
        const id = prefixId(canonicalHost, '#logo')
        organization.logo = defineImage({
          '@id': id,
          'url': ensureBase(canonicalHost, organization.logo),
          'caption': organization.name,
        }).resolve()
        setIfEmpty(organization, 'image', idReference(id))
      }
    },
  })
}
