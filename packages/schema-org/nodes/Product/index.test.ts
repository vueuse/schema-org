import { expect } from 'vitest'
import { useSetup } from '../../../.test'
import { injectSchemaOrg, useSchemaOrg } from '../../useSchemaOrg'
import { definePerson } from '../Person'
import { IdentityId, idReference } from '../../utils'
import type { WebSite } from '../WebSite'
import { PrimaryWebSiteId, defineWebSite } from '../WebSite'
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
            "@id": "https://example.com/#/schema/image/Q6NjKAw0ZO",
            "@type": "ImageObject",
            "contentUrl": "https://example.com/product.png",
            "inLanguage": "en-AU",
            "url": "https://example.com/product.png",
          },
          {
            "@id": "https://example.com/#/schema/person/x29kfkAXdv",
            "@type": "Person",
            "name": "Harlan Wilton",
          },
          {
            "@id": "https://example.com/#product",
            "@type": "Product",
            "aggregateRating": {
              "@id": "https://example.com/#/schema/aggregate-rating/dK3x2rriEA",
              "@type": "AggregateRating",
              "bestRating": 100,
              "ratingCount": 20,
              "ratingValue": 88,
            },
            "image": {
              "@id": "https://example.com/#/schema/image/Q6NjKAw0ZO",
            },
            "name": "test",
            "offers": {
              "@id": "https://example.com/#/schema/offer/ujIBe9HG7H",
              "@type": "Offer",
              "availability": "https://schema.org/InStock",
              "price": 50,
              "priceValidUntil": "2023-12-30T00:00:00.000Z",
              "url": "https://example.com/",
            },
            "review": {
              "@id": "https://example.com/#/schema/review/yDCt2CZzM5",
              "@type": "Review",
              "author": {
                "@id": "https://example.com/#/schema/person/x29kfkAXdv",
              },
              "inLanguage": "en-AU",
              "name": "Awesome product!",
              "reviewRating": {
                "@id": "https://example.com/#/schema/rating/z1q2dd8qmi",
                "@type": "Rating",
                "bestRating": 5,
                "ratingValue": 5,
                "worstRating": 1,
              },
            },
            "sku": "n4bQgYhMfW",
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

      const website = findNode<WebSite>(PrimaryWebSiteId)
      const identity = findNode<WebSite>(IdentityId)

      expect(website?.publisher).toEqual(idReference(identity!))
    })
  })
})
