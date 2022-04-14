import type { IdReference, OptionalMeta, Thing } from '../types'
import { defineNodeResolverSchema, setIfEmpty } from '../utils'

export interface Person extends Thing {
  /**
   * The full name of the Person.
   */
  name: string
  /**
   * The user bio, truncated to 250 characters.
   */
  description?: string
  /**
   * An array of URLs representing declared social/authoritative profiles of the person
   * (e.g., a Wikipedia page, or Facebook profile).
   */
  sameAs?: string[]
  /**
   * An array of images which represent the person, referenced by ID.
   */
  image: IdReference[]
  /**
   * The URL of the users' profile page (if they're affiliated with the site in question),
   * or to their personal homepage/website.
   */
  url: string
}

export interface Organization extends Thing {
  /**
   * A reference-by-ID to an image of the organization's logo.
   *
   * - The image must be 112x112px, at a minimum.
   * - Make sure the image looks how you intend it to look on a purely white background
   * (for example, if the logo is mostly white or gray,
   * it may not look how you want it to look when displayed on a white background).
   */
  logo: IdReference
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
  image?: string[]|IdReference
}

export type Identity = Organization | Person

export const IdentityId = '#identity'

/**
 * Describes an organization (a company, business or institution).
 * Most commonly used to identify the publisher of a WebSite.
 *
 * May be transformed into a more specific type
 * (such as Corporation or LocalBusiness) if the required conditions are met.
 */
export function defineOrganization(organization: OptionalMeta<Organization, 'url'>) {
  return defineNodeResolverSchema(organization, {
    defaults: {
      '@type': 'Organization',
      '@id': IdentityId,
    },
    resolve(webPage, { routeCanonicalUrl }) {
      setIfEmpty(webPage, 'url', routeCanonicalUrl())
      return webPage
    },
    // @todo When location information is available, the Organization may be eligible for extension into a LocalBusiness type.
  })
}

/**
 * Describes an individual person. Most commonly used to identify the author of a piece of content (such as an Article or Comment).
 * @param person
 */
export function definePerson(person: OptionalMeta<Person>) {
  return defineNodeResolverSchema(person, {
    defaults: {
      '@type': 'Person',
      '@id': IdentityId,
    },
    resolve(webPage, { routeCanonicalUrl }) {
      setIfEmpty(webPage, 'url', routeCanonicalUrl())
      return webPage
    },
  })
}
