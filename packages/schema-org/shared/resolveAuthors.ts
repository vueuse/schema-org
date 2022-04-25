import { hash } from 'ohash'
import type { Person } from '../definePerson'
import type { Arrayable, IdReference, SchemaNodeInput } from '../types'
import { definePerson } from '../definePerson'
import { idReference, prefixId, resolver, setIfEmpty } from '../utils'
import type { Article } from '../defineArticle'
import type { Review } from './resolveReviews'

export type AuthorInput = Arrayable<SchemaNodeInput<Person>|IdReference>

export function resolveAuthor<T extends Article|Review>(node: T, field: keyof T) {
  if (node[field]) {
    // @ts-expect-error untyped
    node[field] = resolver(node[field], (authorInput: SchemaNodeInput<Person>, { canonicalHost, addNode }) => {
      setIfEmpty(authorInput, '@id', prefixId(canonicalHost, `#/schema/person/${hash(authorInput.name)}`))
      const personResolver = definePerson(authorInput)
      const person = personResolver.resolve()
      addNode(person)
      return idReference(personResolver.resolveId())
    })
  }
}
