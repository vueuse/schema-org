import { expect } from 'vitest'
import {
  ldJsonScriptTags,
  mockCreateSchemaOptions,
  useHarlansHamburgers,
  useSetup,
} from '../../.test'
import { defineWebSite } from '../nodes/WebSite'
import { defineOrganization } from '../nodes/Organization'
import { defineWebPagePartial } from '../nodes/WebPage'
import { injectSchemaOrg, useSchemaOrg } from './index'

describe('useSchemaOrg', () => {
  it('renders nothing when schema isn\'t provided', async () => {
    useSetup(() => {
      const { graphNodes } = injectSchemaOrg()

      expect(graphNodes.length).toBe(0)
      expect(graphNodes).toMatchInlineSnapshot('[]')
    })
    expect(ldJsonScriptTags()).toMatchInlineSnapshot(`
      NodeList [
        <script
          type="application/ld+json"
        />,
      ]
    `)
  })

  it('renders basic example', () => {
    mockCreateSchemaOptions({
      debug: true,
      canonicalHost: 'https://nuxtjs.org/',
      defaultLanguage: 'en',
    })
    useSetup(() => {
      useSchemaOrg([
        defineOrganization({
          name: 'Nuxt.js',
          logo: '/logo.png',
          sameAs: [
            'https://twitter.com/nuxt_js',
          ],
        }),
        defineWebPagePartial(),
        defineWebSite({
          name: 'Nuxt',
          description: 'Nuxt is a progressive framework for building modern web applications with Vue.js',
        }),
      ])

      const { graphNodes, schemaRef } = injectSchemaOrg()
      expect(graphNodes).toMatchInlineSnapshot(`
        [
          {
            "@id": "https://nuxtjs.org/#logo",
            "@type": "ImageObject",
            "caption": "Nuxt.js",
            "contentUrl": "https://nuxtjs.org/logo.png",
            "inLanguage": "en",
            "url": "https://nuxtjs.org/logo.png",
          },
          {
            "@id": "https://nuxtjs.org/#identity",
            "@type": "Organization",
            "logo": {
              "@id": "https://nuxtjs.org/#logo",
            },
            "name": "Nuxt.js",
            "sameAs": [
              "https://twitter.com/nuxt_js",
            ],
            "url": "https://nuxtjs.org/",
          },
          {
            "@id": "https://nuxtjs.org/#webpage",
            "@type": "WebPage",
            "about": {
              "@id": "https://nuxtjs.org/#identity",
            },
            "isPartOf": {
              "@id": "https://nuxtjs.org/#website",
            },
            "potentialAction": [
              {
                "@type": "ReadAction",
                "target": [
                  "https://nuxtjs.org/",
                ],
              },
            ],
            "primaryImageOfPage": {
              "@id": "https://nuxtjs.org/#logo",
            },
            "url": "https://nuxtjs.org/",
          },
          {
            "@id": "https://nuxtjs.org/#website",
            "@type": "WebSite",
            "description": "Nuxt is a progressive framework for building modern web applications with Vue.js",
            "inLanguage": "en",
            "name": "Nuxt",
            "publisher": {
              "@id": "https://nuxtjs.org/#identity",
            },
            "url": "https://nuxtjs.org/",
          },
        ]
      `)

      expect(schemaRef.value).toMatchInlineSnapshot(`
        "{
          \\"@context\\": \\"https://schema.org\\",
          \\"@graph\\": [
            {
              \\"@type\\": \\"ImageObject\\",
              \\"inLanguage\\": \\"en\\",
              \\"url\\": \\"https://nuxtjs.org/logo.png\\",
              \\"caption\\": \\"Nuxt.js\\",
              \\"@id\\": \\"https://nuxtjs.org/#logo\\",
              \\"contentUrl\\": \\"https://nuxtjs.org/logo.png\\"
            },
            {
              \\"@type\\": \\"Organization\\",
              \\"url\\": \\"https://nuxtjs.org/\\",
              \\"name\\": \\"Nuxt.js\\",
              \\"logo\\": {
                \\"@id\\": \\"https://nuxtjs.org/#logo\\"
              },
              \\"sameAs\\": [
                \\"https://twitter.com/nuxt_js\\"
              ],
              \\"@id\\": \\"https://nuxtjs.org/#identity\\"
            },
            {
              \\"@type\\": \\"WebPage\\",
              \\"@id\\": \\"https://nuxtjs.org/#webpage\\",
              \\"url\\": \\"https://nuxtjs.org/\\",
              \\"potentialAction\\": [
                {
                  \\"@type\\": \\"ReadAction\\",
                  \\"target\\": [
                    \\"https://nuxtjs.org/\\"
                  ]
                }
              ],
              \\"about\\": {
                \\"@id\\": \\"https://nuxtjs.org/#identity\\"
              },
              \\"primaryImageOfPage\\": {
                \\"@id\\": \\"https://nuxtjs.org/#logo\\"
              },
              \\"isPartOf\\": {
                \\"@id\\": \\"https://nuxtjs.org/#website\\"
              }
            },
            {
              \\"@type\\": \\"WebSite\\",
              \\"url\\": \\"https://nuxtjs.org/\\",
              \\"inLanguage\\": \\"en\\",
              \\"name\\": \\"Nuxt\\",
              \\"description\\": \\"Nuxt is a progressive framework for building modern web applications with Vue.js\\",
              \\"@id\\": \\"https://nuxtjs.org/#website\\",
              \\"publisher\\": {
                \\"@id\\": \\"https://nuxtjs.org/#identity\\"
              }
            }
          ],
          \\"data-ssr\\": false
        }"
      `)
    })
  })

  it('should render WebSite', async () => {
    useSetup(() => {
      useSchemaOrg([
        defineWebSite({
          name: 'Test',
        }),
      ])

      const { graphNodes, schemaRef } = injectSchemaOrg()

      expect(graphNodes.length).toEqual(1)
      expect(JSON.parse(schemaRef.value)['@context']).toEqual('https://schema.org')

      expect(graphNodes).toMatchInlineSnapshot(`
        [
          {
            "@id": "https://nuxtjs.org/#website",
            "@type": "WebSite",
            "inLanguage": "en",
            "name": "Test",
            "url": "https://nuxtjs.org/",
          },
        ]
      `)
    })
  })

  it('should render full', async () => {
    useSetup(() => {
      useHarlansHamburgers()

      const { graphNodes, schemaRef } = injectSchemaOrg()

      expect(graphNodes.length).toEqual(4)
      expect(JSON.parse(schemaRef.value)['@context']).toEqual('https://schema.org')

      expect(graphNodes).toMatchInlineSnapshot(`
        [
          {
            "@id": "https://nuxtjs.org/#logo",
            "@type": "ImageObject",
            "contentUrl": "https://harlanshamburgers.com/logo.png",
            "inLanguage": "en",
            "url": "https://harlanshamburgers.com/logo.png",
          },
          {
            "@id": "https://nuxtjs.org/#website",
            "@type": "WebSite",
            "description": "Home to Australia's best burger",
            "inLanguage": "en",
            "name": "Harlan's Hamburgers",
            "publisher": {
              "@id": "https://nuxtjs.org/#identity",
            },
            "url": "https://nuxtjs.org/",
          },
          {
            "@id": "https://nuxtjs.org/#webpage",
            "@type": "WebPage",
            "about": {
              "@id": "https://nuxtjs.org/#identity",
            },
            "isPartOf": {
              "@id": "https://nuxtjs.org/#website",
            },
            "name": "The best hamburger in Australia | Harlan's Hamburger",
            "potentialAction": [
              {
                "@type": "ReadAction",
                "target": [
                  "https://nuxtjs.org/",
                ],
              },
            ],
            "primaryImageOfPage": {
              "@id": "https://nuxtjs.org/#logo",
            },
            "url": "https://nuxtjs.org/",
          },
          {
            "@id": "https://nuxtjs.org/#identity",
            "@type": [
              "Organization",
              "Place",
              "Restaurant",
            ],
            "logo": {
              "@id": "#logo",
            },
            "name": "Harlan's Hamburgers",
            "url": "https://nuxtjs.org/",
          },
        ]
      `)
    })
  })

  it('should allow custom schema.org', () => {
    useSetup(() => {
      useSchemaOrg([
        {
          '@type': 'Event',
          '@id': 'https://example.com/about#event',
          'name': 'The Adventures of Kira and Morrison',
          'startDate': '2025-07-21T19:00-05:00',
          'endDate': '2025-07-21T23:00-05:00',
          'eventAttendanceMode': 'https://schema.org/OfflineEventAttendanceMode',
          'eventStatus': 'https://schema.org/EventScheduled',
          'location': {
            '@type': 'Place',
            'name': 'Snickerpark Stadium',
            'address': {
              '@type': 'PostalAddress',
              'streetAddress': '100 West Snickerpark Dr',
              'addressLocality': 'Snickertown',
              'postalCode': '19019',
              'addressRegion': 'PA',
              'addressCountry': 'US',
            },
          },
          'image': [
            'https://example.com/photos/1x1/photo.jpg',
            'https://example.com/photos/4x3/photo.jpg',
            'https://example.com/photos/16x9/photo.jpg',
          ],
          'description': 'The Adventures of Kira and Morrison is coming to Snickertown in a can\'t miss performance.',
          'offers': {
            '@type': 'Offer',
            'url': 'https://www.example.com/event_offer/12345_201803180430',
            'price': '30',
            'priceCurrency': 'USD',
            'availability': 'https://schema.org/InStock',
            'validFrom': '2024-05-21T12:00',
          },
          'performer': {
            '@type': 'PerformingGroup',
            'name': 'Kira and Morrison',
          },
          'organizer': {
            '@type': 'Organization',
            'name': 'Kira and Morrison Music',
            'url': 'https://kiraandmorrisonmusic.com',
          },
        },
      ])

      const { graphNodes } = injectSchemaOrg()

      expect(graphNodes).toMatchInlineSnapshot(`
        [
          {
            "@id": "https://example.com/about#event",
            "@type": "Event",
            "description": "The Adventures of Kira and Morrison is coming to Snickertown in a can't miss performance.",
            "endDate": "2025-07-21T23:00-05:00",
            "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
            "eventStatus": "https://schema.org/EventScheduled",
            "image": [
              "https://example.com/photos/1x1/photo.jpg",
              "https://example.com/photos/4x3/photo.jpg",
              "https://example.com/photos/16x9/photo.jpg",
            ],
            "location": {
              "@type": "Place",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "US",
                "addressLocality": "Snickertown",
                "addressRegion": "PA",
                "postalCode": "19019",
                "streetAddress": "100 West Snickerpark Dr",
              },
              "name": "Snickerpark Stadium",
            },
            "name": "The Adventures of Kira and Morrison",
            "offers": {
              "@type": "Offer",
              "availability": "https://schema.org/InStock",
              "price": "30",
              "priceCurrency": "USD",
              "url": "https://www.example.com/event_offer/12345_201803180430",
              "validFrom": "2024-05-21T12:00",
            },
            "organizer": {
              "@type": "Organization",
              "name": "Kira and Morrison Music",
              "url": "https://kiraandmorrisonmusic.com",
            },
            "performer": {
              "@type": "PerformingGroup",
              "name": "Kira and Morrison",
            },
            "startDate": "2025-07-21T19:00-05:00",
          },
        ]
      `)
    })
  })
})
