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
            "@id": "https://example.com/#/schema/person/x29kfkAXdv",
            "@type": "Person",
            "name": "Harlan Wilton",
          },
          {
            "@id": "https://example.com/#/schema/comment/Tz8dNuamPI",
            "@type": "Comment",
            "author": {
              "@id": "https://example.com/#/schema/person/x29kfkAXdv",
            },
            "text": "This is a comment",
          },
        ]
      `)
    })
  })
})
