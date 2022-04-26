import { expect } from 'vitest'
import { useSetup } from '../../.test'
import { useSchemaOrg } from '../useSchemaOrg'
import { defineComment } from '.'

describe('defineComment', () => {
  it('can be registered', () => {
    useSetup(() => {
      useSchemaOrg([
        defineComment({
          text: 'This is a comment',
          author: {
            name: 'Harlan Wilton',
          },
        }),
      ])

      const { nodes } = useSchemaOrg()

      expect(nodes).toMatchInlineSnapshot(`
        [
          {
            "@id": "https://example.com/#/schema/person/1230192103",
            "@type": "Person",
            "name": "Harlan Wilton",
            "url": "https://example.com/",
          },
          {
            "@id": "https://example.com/#/schema/comment/2288441280",
            "@type": "Comment",
            "author": {
              "@id": "https://example.com/#/schema/person/1230192103",
            },
            "text": "This is a comment",
          },
        ]
      `)
    })
  })
})
