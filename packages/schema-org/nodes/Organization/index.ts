import type { DeepPartial } from 'utility-types'
import { hash } from 'ohash'
import type { Id, SchemaNodeInput, Thing } from '../../types'
import {
  IdentityId,
  defineSchemaResolver,
  idReference,
  prefixId, resolveId, resolveRawId, resolveType, setIfEmpty,
} from '../../utils'
import type { Image, ImageInput, SingleImageInput } from '../Image'
import type { RelatedAddressInput } from '../PostalAddress'
import { resolveAddress } from '../PostalAddress'
import { resolveImages } from '../Image'
import { defineSchemaOrgComponent } from '../../components/defineSchemaOrgComponent'
import type { WebPage } from '../WebPage'
import { PrimaryWebPageId } from '../WebPage'
import type { WebSite } from '../WebSite'
import { PrimaryWebSiteId } from '../WebSite'

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
  address?: RelatedAddressInput
}

export const defineOrganizationPartial = <K>(input?: DeepPartial<Organization> & K) =>
  // hacky way for users to get around strict typing when using custom schema, route meta or augmentation
  defineOrganization(input as Organization)

/**
 * Describes an organization (a company, business or institution).
 * Most commonly used to identify the publisher of a WebSite.
 *
 * May be transformed into a more specific type
 * (such as Corporation or LocalBusiness) if the required conditions are met.
 */
export function defineOrganization<T extends SchemaNodeInput<Organization>>(input: T) {
  return defineSchemaResolver<T, Organization>(input, {
    required: [
      'name',
      'logo',
    ],
    defaults({ canonicalHost }) {
      return {
        '@type': 'Organization',
        'url': canonicalHost,
      }
    },
    resolve(node, ctx) {
      resolveId(node, ctx.canonicalHost)
      // if @id is not set and we don't have an identity
      if (!node['@id'] && !ctx.findNode(IdentityId))
        node['@id'] = prefixId(ctx.canonicalHost, IdentityId)

      if (!node['@id'])
        setIfEmpty(node, '@id', prefixId(ctx.canonicalHost, `#/schema/organization/${hash(node.name)}`))

      if (node['@type'])
        node['@type'] = resolveType(node['@type'], 'Organization')
      if (node.address)
        node.address = resolveAddress(ctx, node.address) as RelatedAddressInput

      const isIdentity = resolveRawId(node['@id'] || '') === IdentityId
      const webPage = ctx.findNode<WebPage>(PrimaryWebPageId)

      if (node.logo) {
        const mergeWith: { caption: string; ['@id']?: Id } = {
          caption: node.name,
        }
        // only use the #logo id for the identity
        if (isIdentity)
          mergeWith['@id'] = prefixId(ctx.canonicalHost, '#logo')

        node.logo = resolveImages(ctx, node.logo, {
          mergeWith,
          asRootNodes: true,
        }) as SingleImageInput

        if (webPage)
          setIfEmpty(webPage, 'primaryImageOfPage', idReference(node.logo as Image))
      }
      if (isIdentity && webPage)
        setIfEmpty(webPage, 'about', idReference(node as Organization))

      const webSite = ctx.findNode<WebSite>(PrimaryWebSiteId)
      if (webSite)
        setIfEmpty(webSite, 'publisher', idReference(node as Organization))
      return node
    },
  })
}

export const SchemaOrgOrganization = defineSchemaOrgComponent('SchemaOrgOrganization', defineOrganization)
