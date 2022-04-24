import { expect } from 'vitest'
import { useSetup } from '../../.test'
import { useSchemaOrg } from '../useSchemaOrg'
import { definePerson } from '../definePerson'
import { idReference } from '../utils'
import { defineComment } from '.'

describe('defineComment', () => {
  it('can be registered', () => {
    useSetup(() => {
      const person = definePerson({
        name: 'Harlan Wilton',
      })
      useSchemaOrg([
        person,
        defineComment({
          text: 'This is a comment',
          author: idReference(person.resolveId()),
        }),
      ])

      const { nodes } = useSchemaOrg()

      expect(nodes).toMatchInlineSnapshot(`
        [
          {
            "@id": "https://example.com/#identity",
            "@type": "Person",
            "name": "Harlan Wilton",
            "url": "https://example.com/",
          },
          {
            "@id": "https://example.com/#comment/2288441280",
            "@type": "Comment",
            "author": {
              "@id": "https://example.com/#identity",
            },
            "text": "This is a comment",
          },
        ]
      `)
    })
  })
})
