import { expect } from 'vitest'
import { useSetup } from '../../.test'
import { useSchemaOrg } from '../useSchemaOrg'
import { definePerson } from '../definePerson'
import { IdentityId, idReference } from '../utils'
import type { WebSite } from '../defineWebSite'
import { WebSiteId, defineWebSite } from '../defineWebSite'
import { defineProduct } from './index'

describe('defineProduct', () => {
  it('can be registered', () => {
    useSetup(() => {
      useSchemaOrg([
        defineProduct({
          name: 'test',
          offers: [
            { price: 50 },
          ],
          aggregateRating: {
            ratingValue: 88,
            bestRating: 100,
            ratingCount: 20,
          },
        }),
      ])

      const client = useSchemaOrg()

      expect(client.nodes).toMatchInlineSnapshot(`
        [
          {
            "@id": "https://example.com/#product",
            "@type": "Product",
            "aggregateRating": {
              "@type": "AggregateRating",
              "bestRating": 100,
              "ratingCount": 20,
              "ratingValue": 88,
            },
            "name": "test",
            "offers": {
              "@id": "https://example.com/#/schema/offer/1573195564",
              "@type": "Offer",
              "availability": "https://schema.org/InStock",
              "price": 50,
              "url": "https://example.com/",
            },
          },
        ]
      `)
    })
  })

  it('sets up publisher as identity', () => {
    useSetup(() => {
      useSchemaOrg([
        definePerson({
          name: 'Harlan Wilton',
          image: '/image/me.png',
        }),
        defineWebSite({
          name: 'test',
        }),
      ])

      const { findNode } = useSchemaOrg()

      const website = findNode<WebSite>(WebSiteId)
      const identity = findNode<WebSite>(IdentityId)

      expect(website?.publisher).toEqual(idReference(identity!))
    })
  })
})
