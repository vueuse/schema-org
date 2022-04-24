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
        })
          .withAddress({
            addressCountry: 'Australia',
            postalCode: '2000',
            streetAddress: '123 st',
          }),
      ])

      const client = useSchemaOrg()

      expect(client.nodes).toMatchInlineSnapshot(`
        [
          {
            "@id": "https://example.com/#identity",
            "@type": "Organization",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "Australia",
              "postalCode": "2000",
              "streetAddress": "123 st",
            },
            "image": {
              "@id": "https://example.com/#logo",
            },
            "logo": {
              "@id": "https://example.com/#logo",
              "@type": "ImageObject",
              "caption": "test",
              "contentUrl": "https://example.com/logo.png",
              "inLanguage": "en-AU",
              "url": "https://example.com/logo.png",
            },
            "name": "test",
            "url": "https://example.com/",
          },
        ]
      `)
    })
  })
})
