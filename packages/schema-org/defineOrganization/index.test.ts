import { expect } from 'vitest'
import { useSetup } from '../../.test'
import { useSchemaOrg } from '../useSchemaOrg'
import { defineOrganization } from '.'

describe('defineOrganization', () => {
  it('can be registered', () => {
    useSetup(() => {
      useSchemaOrg([
        defineOrganization({
          name: 'test',
          logo: '/logo.png',
          address: {
            addressCountry: 'Australia',
            postalCode: '2000',
            streetAddress: '123 st',
          },
        }),
      ])

      const client = useSchemaOrg()

      expect(client.nodes).toMatchInlineSnapshot(`
        [
          {
            "@id": "https://example.com/#/schema/image/1571960974",
            "@type": "ImageObject",
            "contentUrl": "https://example.com/logo.png",
            "inLanguage": "en-AU",
            "url": "https://example.com/logo.png",
          },
          {
            "@id": "https://example.com/#identity",
            "@type": "Organization",
            "address": {
              "@id": "https://example.com/#/schema/address/3351129328",
              "@type": "PostalAddress",
              "addressCountry": "Australia",
              "postalCode": "2000",
              "streetAddress": "123 st",
            },
            "logo": {
              "@id": "https://example.com/#/schema/image/1571960974",
            },
            "name": "test",
            "url": "https://example.com/",
          },
        ]
      `)
    })
  })
})
