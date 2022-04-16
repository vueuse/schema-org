import type { IdReference, OptionalMeta, Thing } from '../types'
import { IdentityId, defineNodeResolverSchema, prefixId } from '../utils'

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

/**
 * Describes an individual person. Most commonly used to identify the author of a piece of content (such as an Article or Comment).
 * @param person
 */
export function definePerson(person: OptionalMeta<Person>) {
  return defineNodeResolverSchema(person, {
    defaults({ canonicalHost }) {
      return {
        '@type': 'Person',
        '@id': prefixId(canonicalHost, IdentityId),
        'url': canonicalHost,
      }
    },
  })
}
