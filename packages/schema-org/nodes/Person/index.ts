import type { DeepPartial } from 'utility-types'
import { hash } from 'ohash'
import type { Arrayable, IdReference, SchemaNodeInput, SchemaOrgContext, Thing } from '../../types'
import {
  IdentityId,
  defineSchemaResolver,
  idReference,
  prefixId,
  resolveArrayable,
  resolveId, resolveRawId, resolveSchemaResolver, setIfEmpty,
} from '../../utils'
import type { ImageInput } from '../Image'
import { defineSchemaOrgComponent } from '../../components/defineSchemaOrgComponent'

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

export type ChildPersonInput = SchemaNodeInput<Person> | IdReference

export const definePersonPartial = <K>(input?: DeepPartial<Person> & K) =>
  // hacky way for users to get around strict typing when using custom schema, route meta or augmentation
  definePerson(input as Person)

/**
 * Describes an individual person. Most commonly used to identify the author of a piece of content (such as an Article or Comment).
 */
export function definePerson<T extends SchemaNodeInput<Person>>(input: T) {
  return defineSchemaResolver<T, Person>(input, {
    required: [
      'name',
    ],
    defaults({ canonicalHost }) {
      return {
        '@type': 'Person',
        '@id': prefixId(canonicalHost, IdentityId),
      }
    },
    resolve(person, { canonicalHost }) {
      resolveId(person, canonicalHost)
      if (resolveRawId(person['@id'] || '') === IdentityId)
        setIfEmpty(person, 'url', canonicalHost)
      return person as Person
    },
  })
}

export function resolvePerson(ctx: SchemaOrgContext, input: Arrayable<ChildPersonInput>) {
  return resolveArrayable<ChildPersonInput, IdReference>(input, (input) => {
    setIfEmpty(input, '@id', prefixId(ctx.canonicalHost, `#/schema/person/${hash(input.name)}`))
    const person = resolveSchemaResolver(ctx, definePerson(input))
    ctx.addNode(person, ctx)
    return idReference(person['@id'])
  })
}

export const SchemaOrgPerson = defineSchemaOrgComponent('SchemaOrgPerson', definePerson)
