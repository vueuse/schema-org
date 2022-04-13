import { defu } from 'defu'
import type { IdReference, OptionalMeta, Thing } from '../types'
import { useSchemaOrg } from '../useSchemaOrg'

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
  images?: string[]
}

export type Identity = Organization | Person

export const resolveIdentityId = () => {
  const { resolveHostId } = useSchemaOrg()

  return resolveHostId('identity')
}

export function defineOrganization(organization?: OptionalMeta<Organization, 'url'>) {
  const { canonicalHost } = useSchemaOrg()

  const resolvedOrganization = defu(organization || {}, {
    '@type': 'Organization',
    '@id': resolveIdentityId(),
  }) as Organization

  if (!resolvedOrganization.url)
    resolvedOrganization.url = canonicalHost

  return resolvedOrganization
}

export function definePerson(person?: OptionalMeta<Person>) {
  return defu(person || {}, {
    '@type': 'Person',
    '@id': resolveIdentityId(),
  })
}
