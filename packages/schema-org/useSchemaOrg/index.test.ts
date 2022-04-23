import { expect } from 'vitest'
import { firstLdJsonScriptAsJson, ldJsonScriptTags, useHarlansHamburgers, useSetup } from '../../.test'
import { defineWebSite } from '../defineWebSite'
import { defineImage } from '../defineImage'
import { defineRecipe } from '../defineRecipe'
import { defineHowToStep } from '../defineHowTo'
import { defineOrganization } from '../defineOrganization'
import { defineWebPage } from '../defineWebPage'
import { useSchemaOrg } from './index'

describe('useSchemaOrg', () => {
  it('renders nothing when schema isn\'t provided', async() => {
    useSetup(() => {
      const { graph } = useSchemaOrg()

      expect(Object.values(graph.value).length).toBe(0)
      expect(graph.value).toMatchInlineSnapshot('{}')
    })
    expect(ldJsonScriptTags().length).toEqual(0)
  })

  it('renders basic example', () => {
    useSetup(() => {
      useSchemaOrg([
        defineOrganization({
          name: 'Nuxt.js',
          logo: 'https://vueuse.js.org/logo.png',
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
            "@id": "https://example.com/#identity",
            "url": "https://example.com/",
            "name": "Nuxt.js",
            "logo": {
              "@id": "https://example.com/#logo"
            },
            "sameAs": [
              "https://twitter.com/nuxt_js"
            ]
          },
          {
            "@type": "WebPage",
            "@id": "https://example.com/#webpage",
            "url": "https://example.com/",
            "potentialAction": [
              {
                "@type": "ReadAction",
                "target": [
                  "https://example.com/"
                ]
              }
            ],
            "about": {
              "@id": "https://example.com/#identity"
            },
            "primaryImageOfPage": {
              "@id": "https://example.com/#logo"
            },
            "isPartOf": {
              "@id": "https://example.com/#website"
            }
          },
          {
            "@type": "WebSite",
            "@id": "https://example.com/#website",
            "url": "https://example.com/",
            "name": "Nuxt",
            "description": "Nuxt is a progressive framework for building modern web applications with Vue.js",
            "publisher": {
              "@id": "https://example.com/#identity"
            }
          },
          {
            "@type": "ImageObject",
            "inLanguage": "en-AU",
            "@id": "https://example.com/#logo",
            "url": "https://vueuse.js.org/logo.png",
            "caption": "Nuxt.js",
            "contentUrl": "https://vueuse.js.org/logo.png"
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
            "@id": "https://example.com/#website",
            "@type": "WebSite",
            "name": "Test",
            "url": "https://example.com/",
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
            "inLanguage": "en-AU",
            "url": "https://harlanshamburgers.com/logo.png",
          },
          {
            "@id": "https://example.com/#website",
            "@type": "WebSite",
            "description": "Home to Australia's best burger",
            "name": "Harlan's Hamburgers",
            "publisher": {
              "@id": "https://example.com/#identity",
            },
            "url": "https://example.com/",
          },
          {
            "@id": "https://example.com/#webpage",
            "@type": "WebPage",
            "about": {
              "@id": "https://example.com/#identity",
            },
            "isPartOf": {
              "@id": "https://example.com/#website",
            },
            "name": "The best hamburger in Australia | Harlan's Hamburger",
            "potentialAction": [
              {
                "@type": "ReadAction",
                "target": [
                  "https://example.com/",
                ],
              },
            ],
            "primaryImageOfPage": {
              "@id": "#logo",
            },
            "url": "https://example.com/",
          },
          {
            "@id": "https://example.com/#identity",
            "@type": [
              "Organization",
              "Place",
              "Restaurant",
            ],
            "logo": {
              "@id": "#logo",
            },
            "name": "Harlan's Hamburgers",
            "url": "https://example.com/",
          },
        ],
      }
    `)
  })

  it('should allow getting the current root schema tag', async() => {
    useSetup(() => {
      const recipeImage = defineImage({
        '@id': '#recipeImage',
        'url': 'https://example.com/photos/1x1/photo.jpg',
      })
      useSchemaOrg([
        recipeImage,
        defineRecipe({
          name: 'Peanut Butter Cookies',
          recipeIngredient: ['Peanut Butter', 'Cookie Dough'],
          recipeInstructions: [
            defineHowToStep({
              url: '#mylink',
              text: 'Bake at 200*C for 40 minutes, or until golden-brown, stirring periodically throughout',
            }),
          ],
          image: {
            '@id': '#recipeImage',
          },
        }),
      ])

      expect(useSchemaOrg().nodes).toMatchInlineSnapshot(`
        [
          {
            "@id": "#recipeImage",
            "@type": "ImageObject",
            "contentUrl": "https://example.com/photos/1x1/photo.jpg",
            "inLanguage": "en-AU",
            "url": "https://example.com/photos/1x1/photo.jpg",
          },
          {
            "@id": "#recipe",
            "@type": "Recipe",
            "image": {
              "@id": "#recipeImage",
            },
            "name": "Peanut Butter Cookies",
            "recipeIngredient": [
              "Peanut Butter",
              "Cookie Dough",
            ],
            "recipeInstructions": [
              {
                "@type": "HowToStep",
                "text": "Bake at 200*C for 40 minutes, or until golden-brown, stirring periodically throughout",
                "url": "#mylink",
              },
            ],
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
