import { expect } from 'vitest'
import { computed, unref } from 'vue'
import { mockRoute, useSetup } from '../../.test'
import { injectSchemaOrg, useSchemaOrg } from '../useSchemaOrg'
import type { WebPage } from './index'
import { PrimaryWebPageId, asReadAction, defineWebPage, defineWebPagePartial } from './index'

const mockDate = new Date(Date.UTC(2021, 10, 10, 10, 10, 10, 0))

describe('defineWebPage', () => {
  it('can be registered', () => {
    useSetup(() => {
      useSchemaOrg([
        defineWebPage({
          name: computed(() => 'test'),
          datePublished: mockDate,
          dateModified: mockDate,
        }),
      ])

      const client = injectSchemaOrg()
      const webPage = client.findNode<WebPage>(PrimaryWebPageId)
      expect(unref(webPage)).toMatchInlineSnapshot(`
        {
          "@id": "https://example.com/#webpage",
          "@type": "WebPage",
          "dateModified": "2021-11-10T10:10:10.000Z",
          "datePublished": "2021-11-10T10:10:10.000Z",
          "name": "test",
          "potentialAction": [
            {
              "@type": "ReadAction",
              "target": [
                "https://example.com/",
              ],
            },
          ],
          "url": "https://example.com/",
        }
      `)
    })
  })

  it('inherits attributes from useRoute()', () => {
    mockRoute({
      path: '/test',
      meta: {
        title: 'headline',
        description: 'description',
      },
    }, () => {
      useSetup(() => {
        useSchemaOrg([
          defineWebPagePartial(),
        ])

        const client = injectSchemaOrg()
        const webPage = unref(client.findNode<WebPage>(PrimaryWebPageId))

        expect(webPage?.name).toEqual('headline')

        expect(webPage).toMatchInlineSnapshot(`
          {
            "@id": "https://example.com/test/#webpage",
            "@type": "WebPage",
            "description": "description",
            "name": "headline",
            "potentialAction": [
              {
                "@type": "ReadAction",
                "target": [
                  "https://example.com/test",
                ],
              },
            ],
            "url": "https://example.com/test",
          }
        `)
      })
    })
  })

  it('passes Date objects into iso string', () => {
    useSetup(() => {
      useSchemaOrg([
        defineWebPage({
          name: 'test',
          datePublished: new Date(Date.UTC(2021, 10, 1, 0, 0, 0)),
          dateModified: new Date(Date.UTC(2022, 1, 1, 0, 0, 0)),
        }),
      ])

      const client = injectSchemaOrg()
      const webPage = client.findNode<WebPage>('#webpage')

      expect(webPage?.datePublished).toEqual('2021-11-01T00:00:00.000Z')
      expect(webPage?.dateModified).toEqual('2022-02-01T00:00:00.000Z')
    })
  })

  it('allows overriding the type', () => {
    useSetup(() => {
      useSchemaOrg([
        defineWebPage({
          '@type': 'FAQPage',
          'name': 'FAQ',
        }),
      ])

      const client = injectSchemaOrg()
      const webPage = client.findNode<WebPage>(PrimaryWebPageId)

      expect(webPage?.['@type']).toEqual(['WebPage', 'FAQPage'])
    })
  })

  it('adds read action to home page', () => {
    mockRoute({
      path: '/',
      meta: {
        title: 'headline',
        description: 'description',
      },
    }, () => {
      useSetup(() => {
        useSchemaOrg([
          defineWebPagePartial(),
        ])

        const client = injectSchemaOrg()
        const webpage = unref(client.findNode<WebPage>(PrimaryWebPageId))

        expect(webpage).toMatchInlineSnapshot(`
          {
            "@id": "https://example.com/#webpage",
            "@type": "WebPage",
            "description": "description",
            "name": "headline",
            "potentialAction": [
              {
                "@type": "ReadAction",
                "target": [
                  "https://example.com/",
                ],
              },
            ],
            "url": "https://example.com/",
          }
        `)
      })
    })
  })

  it('as readAction', () => {
    mockRoute({
      path: '/our-pages/about-us',
    }, () => {
      useSetup(() => {
        useSchemaOrg([
          defineWebPage({
            name: 'Webpage',
            potentialAction: [
              asReadAction(),
            ],
          }),
        ])

        const client = injectSchemaOrg()
        const webpage = client.findNode<WebPage>(PrimaryWebPageId)

        expect(webpage?.potentialAction).toMatchInlineSnapshot(`
        [
          {
            "@type": "ReadAction",
            "target": [
              "https://example.com/our-pages/about-us",
            ],
          },
        ]
      `)
      })
    })
  })

  it('can infer @type from path', () => {
    mockRoute({
      path: '/our-pages/about-us',
    }, () => {
      useSetup(() => {
        useSchemaOrg([
          defineWebPagePartial(),
        ])

        const client = injectSchemaOrg()
        const webpage = client.findNode<WebPage>(PrimaryWebPageId)

        expect(webpage?.['@type']).toMatchInlineSnapshot(`
        [
          "WebPage",
          "AboutPage",
        ]
      `)
      })
    })
  })

  it('allows @type augmentation on matching #id', () => {
    useSetup(() => {
      useSchemaOrg([
        defineWebPagePartial(),
      ])

      const { findNode } = injectSchemaOrg()
      let webPage = findNode<WebPage>(PrimaryWebPageId)
      expect(webPage?.['@type']).toEqual('WebPage')

      useSchemaOrg([
        defineWebPagePartial({
          '@type': ['CollectionPage', 'SearchResultsPage'],
        }),
      ])

      webPage = findNode<WebPage>(PrimaryWebPageId)
      expect(webPage?.['@type']).toEqual(['WebPage', 'CollectionPage', 'SearchResultsPage'])
    })
  })
})
