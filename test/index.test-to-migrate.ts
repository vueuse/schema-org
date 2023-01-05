import { expect } from 'vitest'
import type { WebPage } from 'schema-org-graph-js'
import {
  PrimaryWebPageId, dedupeAndFlattenNodes,
  renderNodesToSchemaOrgHtml,
} from 'schema-org-graph-js'
import { computed, getCurrentInstance, ref } from 'vue'
import {
  ldJsonScriptTags,
  mockCreateSchemaOptions,
  useHarlansHamburgers,
  useSetup,
} from '../../../.test'
import { defineOrganization, defineWebPage, defineWebSite } from '../../simple'
import { injectSchemaOrg, useSchemaOrg } from './index'

describe('useSchemaOrg', () => {
  it('renders nothing when schema isn\'t provided', async () => {
    useSetup(() => {
      const { ctx } = injectSchemaOrg()

      expect(ctx.nodes.length).toBe(0)
      expect(ctx.nodes).toMatchInlineSnapshot('[]')
    })
    expect(ldJsonScriptTags()).toMatchInlineSnapshot(`
      NodeList [
        <script
          data-id="schema-org-graph"
          isbodytag="true"
          type="application/ld+json"
        />,
      ]
    `)
  })

  it('handles reactivity', () => {
    useSetup(() => {
      const name = ref('name')

      useSchemaOrg([
        defineWebPage({
          name: computed(() => `hi, my name is ${name.value}`),
        }),

      ])
      name.value = 'harlan'

      const { resolveGraph } = injectSchemaOrg()

      const nodes = dedupeAndFlattenNodes(resolveGraph().nodes)

      expect(nodes[0].name).toMatchInlineSnapshot('"hi, my name is harlan"')
    })
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
          logo: computed(() => '/logo.png'),
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

      const { resolveGraph } = injectSchemaOrg()

      const nodes = dedupeAndFlattenNodes(resolveGraph().nodes)

      const schemaRef = renderNodesToSchemaOrgHtml(nodes)

      expect(nodes).toMatchInlineSnapshot(`
        [
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
          {
            "@id": "https://nuxtjs.org/#logo",
            "@type": "ImageObject",
            "caption": "Nuxt.js",
            "contentUrl": "https://nuxtjs.org/logo.png",
            "inLanguage": "en",
            "url": "https://nuxtjs.org/logo.png",
          },
        ]
      `)

      expect(schemaRef).toMatchInlineSnapshot(`
        "{
          \\"@context\\": \\"https://schema.org\\",
          \\"@graph\\": [
            {
              \\"@id\\": \\"https://nuxtjs.org/#identity\\",
              \\"@type\\": \\"Organization\\",
              \\"logo\\": {
                \\"@id\\": \\"https://nuxtjs.org/#logo\\"
              },
              \\"name\\": \\"Nuxt.js\\",
              \\"sameAs\\": [
                \\"https://twitter.com/nuxt_js\\"
              ],
              \\"url\\": \\"https://nuxtjs.org/\\"
            },
            {
              \\"@id\\": \\"https://nuxtjs.org/#webpage\\",
              \\"@type\\": \\"WebPage\\",
              \\"about\\": {
                \\"@id\\": \\"https://nuxtjs.org/#identity\\"
              },
              \\"isPartOf\\": {
                \\"@id\\": \\"https://nuxtjs.org/#website\\"
              },
              \\"potentialAction\\": [
                {
                  \\"@type\\": \\"ReadAction\\",
                  \\"target\\": [
                    \\"https://nuxtjs.org/\\"
                  ]
                }
              ],
              \\"primaryImageOfPage\\": {
                \\"@id\\": \\"https://nuxtjs.org/#logo\\"
              },
              \\"url\\": \\"https://nuxtjs.org/\\"
            },
            {
              \\"@id\\": \\"https://nuxtjs.org/#website\\",
              \\"@type\\": \\"WebSite\\",
              \\"description\\": \\"Nuxt is a progressive framework for building modern web applications with Vue.js\\",
              \\"inLanguage\\": \\"en\\",
              \\"name\\": \\"Nuxt\\",
              \\"publisher\\": {
                \\"@id\\": \\"https://nuxtjs.org/#identity\\"
              },
              \\"url\\": \\"https://nuxtjs.org/\\"
            },
            {
              \\"@id\\": \\"https://nuxtjs.org/#logo\\",
              \\"@type\\": \\"ImageObject\\",
              \\"caption\\": \\"Nuxt.js\\",
              \\"contentUrl\\": \\"https://nuxtjs.org/logo.png\\",
              \\"inLanguage\\": \\"en\\",
              \\"url\\": \\"https://nuxtjs.org/logo.png\\"
            }
          ]
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

      const { ctx, resolveGraph, generateSchema } = injectSchemaOrg()

      expect(ctx.nodes.length).toEqual(1)
      expect(JSON.parse(generateSchema())['@context']).toEqual('https://schema.org')

      const nodes = dedupeAndFlattenNodes(resolveGraph().nodes)

      expect(nodes).toMatchInlineSnapshot(`
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

      const { resolveGraph } = injectSchemaOrg()

      const nodes = dedupeAndFlattenNodes(resolveGraph().nodes)

      expect(nodes.length).toEqual(4)

      expect(nodes).toMatchInlineSnapshot(`
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

      const { resolveGraph } = injectSchemaOrg()
      const nodes = dedupeAndFlattenNodes(resolveGraph().nodes)

      expect(nodes).toMatchInlineSnapshot(`
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

describe('createSchemaOrg', () => {
  it('can be created', () => {
    useSetup(() => {
      const client = createMockClient()

      const vm = getCurrentInstance()!
      client.ctx._ctxUid = vm.uid

      expect(client.ctx.meta.canonicalHost).toEqual('https://example.com/')
      expect(client.ctx.nodes.length).toEqual(0)
    })
  })

  it('can add nodes', () => {
    useSetup(() => {
      const client = createMockClient()

      const vm = getCurrentInstance()!
      client.ctx._ctxUid = vm.uid

      client.ctx.addNode([
        defineWebPage(),
      ])

      const nodes = getNodes(client)

      expect(nodes).toMatchInlineSnapshot(`
        [
          {
            "@id": "https://example.com/#webpage",
            "@type": "WebPage",
            "potentialAction": [
              {
                "@type": "ReadAction",
                "target": [
                  "https://example.com/",
                ],
              },
            ],
            "url": "https://example.com/",
          },
        ]
      `)
      expect(nodes.length).toEqual(1)
    })
  })

  it('can remove nodes', () => {
    useSetup(() => {
      const client = createMockClient()

      const vm = getCurrentInstance()!
      client.ctx._ctxUid = vm.uid

      client.ctx.addNode([
        defineWebPage({
          '@id': '#my-webpage',
          'name': 'test',
        }),
      ])

      let nodes = getNodes(client)

      expect(nodes.length).toEqual(1)

      client.removeContext(vm.uid)

      nodes = getNodes(client)
      expect(nodes.length).toEqual(0)
    })
  })

  it('can find node', () => {
    useSetup(() => {
      const client = createMockClient()

      const vm = getCurrentInstance()!
      client.ctx._ctxUid = vm.uid

      client.ctx.addNode([
        defineWebPage({
          '@id': '#my-webpage',
          'name': 'test',
        }),
      ])

      const ctx = client.resolveGraph()

      const node = ctx.findNode('#my-webpage')

      expect(node?.['@id']).toEqual('https://example.com/#my-webpage')
    })
  })

  it('can handle hierarchy', () => {
    useSetup(() => {
      const client = createMockClient()

      const vm = getCurrentInstance()!
      client.ctx._ctxUid = vm.uid

      client.ctx.addNode([
        defineWebPage(),
      ])

      const ctx = client.resolveGraph()

      let node = ctx.findNode<WebPage>(PrimaryWebPageId)
      expect(node?.['@id']).toEqual('https://example.com/#webpage')
      expect(node?.name).toBeUndefined()
      expect(ctx.nodes.length).toEqual(1)

      ctx._ctxUid = 100

      client.ctx.addNode([
        defineWebPage({
          '@type': 'FAQPage',
          'name': 'FAQ',
        }),
      ])

      const dedupedNodes = dedupeAndFlattenNodes(client.resolveGraph().nodes)

      expect(dedupedNodes.length).toEqual(1)
      node = dedupedNodes[0]
      expect(node?.['@id']).toEqual('https://example.com/#webpage')
      expect(node?.name).toEqual('FAQ')
      expect(node?.['@type']).toEqual(['WebPage', 'FAQPage'])
    })
  })
})
