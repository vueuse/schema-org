import { expect } from 'vitest'
import { useSetup } from '../../../.test'
import { injectSchemaOrg, useSchemaOrg } from '../../useSchemaOrg'
import { definePlace } from './index'

describe('definePlace', () => {
  it('can be registered', () => {
    useSetup(() => {
      useSchemaOrg([
        definePlace({
          'name': 'test',
          'address': {
            addressCountry: 'Australia',
            postalCode: '2000',
            streetAddress: '123 st',
          },
        }),
      ])

      const { graphNodes } = injectSchemaOrg()

      expect(graphNodes).toMatchInlineSnapshot(`
        [
          {
            "@id": "https://example.com/#identity",
            "@type": "Place",
            "address": {
              "@id": "https://example.com/#/schema/address/3351129328",
              "@type": "PostalAddress",
              "addressCountry": "Australia",
              "postalCode": "2000",
              "streetAddress": "123 st",
            },
            "name": "test",
            "url": "https://example.com/",
          },
        ]
      `)
    })
  })
})
