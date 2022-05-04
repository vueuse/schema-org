import { expect } from 'vitest'
import { useSetup } from '../../.test'
import { injectSchemaOrg, useSchemaOrg } from '../useSchemaOrg'
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
          image: '/product.png',
          offers: [
            { price: 50 },
          ],
          aggregateRating: {
            ratingValue: 88,
            bestRating: 100,
            ratingCount: 20,
          },
          review: [
            {
              name: 'Awesome product!',
              author: {
                name: 'Harlan Wilton',
              },
              reviewRating: {
                ratingValue: 5,
              },
            },
          ],
        }),
      ])

      const { graphNodes } = injectSchemaOrg()

      expect(graphNodes).toMatchInlineSnapshot(`
        [
          {
            "@id": "https://example.com/#/schema/image/1032368654",
            "@type": "ImageObject",
            "contentUrl": "https://example.com/product.png",
            "inLanguage": "en-AU",
            "url": "https://example.com/product.png",
          },
          {
            "@id": "https://example.com/#/schema/person/1230192103",
            "@type": "Person",
            "name": "Harlan Wilton",
          },
          {
            "@id": "https://example.com/#product",
            "@type": "Product",
            "aggregateRating": {
              "@type": "AggregateRating",
              "bestRating": 100,
              "ratingCount": 20,
              "ratingValue": 88,
            },
            "image": {
              "@id": "https://example.com/#/schema/image/1032368654",
            },
            "name": "test",
            "offers": {
              "@id": "https://example.com/#/schema/offer/1573195564",
              "@type": "Offer",
              "availability": "https://schema.org/InStock",
              "price": 50,
              "priceValidUntil": "2023-12-30T00:00:00.000Z",
              "url": "https://example.com/",
            },
            "review": {
              "@id": "https://example.com/#/schema/review/2109888563",
              "@type": "Review",
              "author": {
                "@id": "https://example.com/#/schema/person/1230192103",
              },
              "inLanguage": "en-AU",
              "name": "Awesome product!",
              "reviewRating": {
                "@type": "Rating",
                "bestRating": 5,
                "ratingValue": 5,
                "worstRating": 1,
              },
            },
            "sku": "3127628307",
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

      const { findNode } = injectSchemaOrg()

      const website = findNode<WebSite>(WebSiteId)
      const identity = findNode<WebSite>(IdentityId)

      expect(website?.publisher).toEqual(idReference(identity!))
    })
  })
})
