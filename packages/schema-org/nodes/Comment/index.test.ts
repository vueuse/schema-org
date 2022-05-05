import { expect } from 'vitest'
import { useSetup } from '../../../.test'
import { injectSchemaOrg, useSchemaOrg } from '../../useSchemaOrg'
import { defineComment } from './index'

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

      const { graphNodes } = injectSchemaOrg()
      expect(graphNodes).toMatchInlineSnapshot(`
        [
          {
            "@id": "https://example.com/#/schema/person/1230192103",
            "@type": "Person",
            "name": "Harlan Wilton",
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
