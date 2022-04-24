import { hash } from 'ohash'
import type { Person } from '../definePerson'
import type { WithAmbigiousFields } from '../types'
import { definePerson } from '../definePerson'
import { idReference, prefixId, setIfEmpty } from '../utils'
import type { ArticleNodeResolver } from './index'

export type WithAuthorInput = WithAmbigiousFields<Person>
export type WithAuthorsInput = WithAmbigiousFields<Person>[]

export function withAuthors(resolver: ArticleNodeResolver) {
  return (authorsInput: WithAuthorsInput) => {
    resolver.append.push(
      ({ canonicalHost, addNode }) => {
        const ids = authorsInput.map((authorInput) => {
          setIfEmpty(authorInput, '@id', prefixId(canonicalHost, `#/schema/person/${hash(authorInput.name)}`))
          const personResolver = definePerson(authorInput)
          const person = personResolver.resolve()
          addNode(person)
          return idReference(personResolver.resolveId())
        })
        return {
          author: ids,
        }
      },
    )
    return resolver
  }
}
