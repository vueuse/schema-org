import { hash } from 'ohash'
import type { Person } from '../definePerson'
import type { Arrayable, IdReference, SchemaNodeInput } from '../types'
import { definePerson } from '../definePerson'
import { idReference, prefixId, resolver, setIfEmpty } from '../utils'

export type AuthorInput = SchemaNodeInput<Person> | IdReference

export function resolveAuthor(input: Arrayable<AuthorInput>) {
  return resolver<AuthorInput, IdReference>(input, (input, client) => {
    const { canonicalHost, addNode } = client
    setIfEmpty(input, '@id', prefixId(canonicalHost, `#/schema/person/${hash(input.name)}`))
    const personResolver = definePerson(input)
    const person = personResolver.resolve(client)
    addNode(person)
    return idReference(person['@id'])
  })
}
