import { hash } from 'ohash'
import type { SchemaOrgContext } from '../createSchemaOrg'
import type { Person } from '../definePerson'
import type { Arrayable, IdReference, SchemaNodeInput } from '../types'
import { definePerson } from '../definePerson'
import { idReference, prefixId, resolveArrayable, setIfEmpty } from '../utils'

export type AuthorInput = SchemaNodeInput<Person> | IdReference

export function resolveAuthor(client: SchemaOrgContext, input: Arrayable<AuthorInput>) {
  return resolveArrayable<AuthorInput, IdReference>(input, (input) => {
    setIfEmpty(input, '@id', prefixId(client.canonicalHost, `#/schema/person/${hash(input.name)}`))
    const personResolver = definePerson(input)
    const person = personResolver.resolve(client)
    client.addNode(person)
    return idReference(person['@id'])
  })
}
