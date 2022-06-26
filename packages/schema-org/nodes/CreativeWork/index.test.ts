import { expect } from 'vitest'
import { useSetup } from '../../../.test'
import { injectSchemaOrg, useSchemaOrg } from '../../useSchemaOrg'
import { defineCreativeWork } from './index'

describe('defineCreativeWork', () => {
  it('can be registered', () => {
    useSetup(() => {
      useSchemaOrg([
        defineCreativeWork({
          name: 'test',
        }),
      ])

      const { graphNodes } = injectSchemaOrg()

      expect(graphNodes).toMatchInlineSnapshot(`
        [
          {
            "@id": "https://example.com/#identity",
            "@type": "CreativeWork",
            "name": "test",
            "url": "https://example.com/",
          },
        ]
      `)
    })
  })
})
