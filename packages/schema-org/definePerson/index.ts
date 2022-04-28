import type { DeepPartial } from 'utility-types'
import type { SchemaNodeInput, Thing } from '../types'
import type { NodeResolverOptions } from '../utils'
import { IdentityId, callAsPartial, defineNodeResolver, prefixId, resolveId } from '../utils'
import type { ImageInput } from '../shared/resolveImages'

/**
 * A person (alive, dead, undead, or fictional).
 */
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
  image?: ImageInput
  /**
   * The URL of the users' profile page (if they're affiliated with the site in question),
   * or to their personal homepage/website.
   */
  url?: string
}

export const definePersonPartial = <K>(input?: DeepPartial<Person> & K) =>
  // hacky way for users to get around strict typing when using custom schema, route meta or augmentation
  callAsPartial(definePerson, input)

/**
 * Describes an individual person. Most commonly used to identify the author of a piece of content (such as an Article or Comment).
 */
export function definePerson<T extends SchemaNodeInput<Person>>(input: T, options?: NodeResolverOptions) {
  return defineNodeResolver<T, Person>(input, {
    required: [
      'name',
    ],
    defaults({ canonicalHost }) {
      return {
        '@type': 'Person',
        '@id': prefixId(canonicalHost, IdentityId),
        'url': canonicalHost,
      }
    },
    resolve(person, { canonicalHost }) {
      resolveId(person, canonicalHost)
      return person as Person
    },
  }, options)
}
