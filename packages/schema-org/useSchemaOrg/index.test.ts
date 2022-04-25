import { expect } from 'vitest'
import {
  firstLdJsonScriptAsJson,
  ldJsonScriptTags,
  mockCreateSchemaOptions,
  useHarlansHamburgers,
  useSetup,
} from '../../.test'
import { defineWebSite } from '../defineWebSite'
import { defineOrganization } from '../defineOrganization'
import { defineWebPage } from '../defineWebPage'
import { useSchemaOrg } from './index'

describe('useSchemaOrg', () => {
  it('renders nothing when schema isn\'t provided', async() => {
    useSetup(() => {
      const { idGraph } = useSchemaOrg()

      expect(Object.values(idGraph.value).length).toBe(0)
      expect(idGraph.value).toMatchInlineSnapshot('{}')
    })
    expect(ldJsonScriptTags().length).toEqual(0)
  })

  it('renders basic example', () => {
    mockCreateSchemaOptions({
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
        defineWebPage(),
        defineWebSite({
          name: 'Nuxt',
          description: 'Nuxt is a progressive framework for building modern web applications with Vue.js',
        }),
      ])
    })

    expect(ldJsonScriptTags()).toMatchInlineSnapshot(`
      NodeList [
        <script
          type="application/ld+json"
        >
          {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            "@id": "https://nuxtjs.org/#identity",
            "url": "https://nuxtjs.org/",
            "name": "Nuxt.js",
            "logo": {
              "@type": "ImageObject",
              "inLanguage": "en",
              "@id": "https://nuxtjs.org/#logo",
              "url": "https://nuxtjs.org/logo.png",
              "caption": "Nuxt.js",
              "contentUrl": "https://nuxtjs.org/logo.png"
            },
            "sameAs": [
              "https://twitter.com/nuxt_js"
            ],
            "image": {
              "@id": "https://nuxtjs.org/#logo"
            }
          },
          {
            "@type": "WebPage",
            "@id": "https://nuxtjs.org/#webpage",
            "url": "https://nuxtjs.org/",
            "potentialAction": [
              {
                "@type": "ReadAction",
                "target": [
                  "https://nuxtjs.org/"
                ]
              }
            ],
            "about": {
              "@id": "https://nuxtjs.org/#identity"
            },
            "primaryImageOfPage": {
              "@id": "https://nuxtjs.org/#logo"
            },
            "isPartOf": {
              "@id": "https://nuxtjs.org/#website"
            }
          },
          {
            "@type": "WebSite",
            "@id": "https://nuxtjs.org/#website",
            "url": "https://nuxtjs.org/",
            "inLanguage": "en",
            "name": "Nuxt",
            "description": "Nuxt is a progressive framework for building modern web applications with Vue.js",
            "publisher": {
              "@id": "https://nuxtjs.org/#identity"
            }
          }
        ]
      }
        </script>,
      ]
    `)
  })

  it('should render WebSite', async() => {
    useSetup(() => {
      useSchemaOrg([
        defineWebSite({
          name: 'Test',
        }),
      ])
    })

    expect(ldJsonScriptTags().length).toEqual(1)
    expect(firstLdJsonScriptAsJson()['@context']).toEqual('https://schema.org')

    expect(firstLdJsonScriptAsJson()).toMatchInlineSnapshot(`
      {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@id": "https://nuxtjs.org/#website",
            "@type": "WebSite",
            "inLanguage": "en",
            "name": "Test",
            "url": "https://nuxtjs.org/",
          },
        ],
      }
    `)
  })

  it('should render full', async() => {
    useSetup(() => {
      useHarlansHamburgers()
    })

    expect(ldJsonScriptTags().length).toEqual(1)
    expect(firstLdJsonScriptAsJson()['@context']).toEqual('https://schema.org')

    expect(firstLdJsonScriptAsJson()).toMatchInlineSnapshot(`
      {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@id": "#logo",
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
              "@id": "#logo",
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
        ],
      }
    `)
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

      expect(useSchemaOrg().nodes).toMatchInlineSnapshot(`
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
