import { expect } from 'vitest'
import { useSetup } from '../../../.test'
import { injectSchemaOrg, useSchemaOrg } from '../../useSchemaOrg'
import { defineEvent } from './index'

describe('defineEvent', () => {
  it('can be registered', () => {
    useSetup(() => {
      useSchemaOrg([
        defineEvent({
          '@type': 'Event',
          'name': 'test',
        }),
      ])

      const { graphNodes } = injectSchemaOrg()

      expect(graphNodes).toMatchInlineSnapshot(`
        [
          {
            "@id": "https://example.com/#identity",
            "@type": "Event",
            "name": "test",
            "url": "https://example.com/",
          },
        ]
      `)
    })
  })
})
