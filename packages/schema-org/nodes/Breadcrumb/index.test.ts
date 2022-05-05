import { expect } from 'vitest'
import { useSetup } from '../../../.test'
import { injectSchemaOrg, useSchemaOrg } from '../../useSchemaOrg'
import type { Breadcrumb } from './index'
import { PrimaryBreadcrumbId, defineBreadcrumb, defineBreadcrumbPartial } from './index'

describe('defineBreadcrumb', () => {
  it('can be registered', () => {
    useSetup(() => {
      useSchemaOrg([
        defineBreadcrumb({
          itemListElement: [
            { name: 'Home', item: '/' },
            { name: 'Blog', item: '/blog' },
            { name: 'My Article' },
          ],
        }),
      ])

      const { findNode } = injectSchemaOrg()

      const breadcrumbs = findNode<Breadcrumb>(PrimaryBreadcrumbId)

      expect(breadcrumbs).toMatchInlineSnapshot(`
        {
          "@id": "https://example.com/#breadcrumb",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "item": "https://example.com",
              "name": "Home",
              "position": 1,
            },
            {
              "@type": "ListItem",
              "item": "https://example.com/blog",
              "name": "Blog",
              "position": 2,
            },
            {
              "@type": "ListItem",
              "name": "My Article",
              "position": 3,
            },
          ],
        }
      `)
    })
  })

  it('can handle duplicate', () => {
    useSetup(() => {
      useSchemaOrg([
        defineBreadcrumb({
          itemListElement: [
            { name: 'Home', item: '/', position: 1 },
            { name: 'Blog', item: '/blog', position: 2 },
            { name: 'My Article', position: 4 },
          ],
        }),

        defineBreadcrumb({
          itemListElement: [
            { name: 'Some joining page', item: '/blog/test', position: 3 },
          ],
        }),

        defineBreadcrumb({
          '@id': '#subbreadcrumb',
          'itemListElement': [
            { name: 'Some other link', item: '/blog/test' },
          ],
        }),

        defineBreadcrumbPartial<{ custom: string }>({
          '@id': '#subbreadcrumb',
          'custom': 'test',
          'itemListElement': [
            { name: 'Some other link', item: '/blog/test' },
          ],
        }),
      ])

      const client = injectSchemaOrg()

      expect(client.graphNodes).toMatchInlineSnapshot(`
        [
          {
            "@id": "https://example.com/#breadcrumb",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "item": "https://example.com/blog/test",
                "name": "Some joining page",
                "position": 3,
              },
              {
                "@type": "ListItem",
                "item": "https://example.com",
                "name": "Home",
                "position": 1,
              },
              {
                "@type": "ListItem",
                "item": "https://example.com/blog",
                "name": "Blog",
                "position": 2,
              },
              {
                "@type": "ListItem",
                "name": "My Article",
                "position": 4,
              },
            ],
          },
          {
            "@id": "https://example.com/#subbreadcrumb",
            "@type": "BreadcrumbList",
            "custom": "test",
            "itemListElement": [
              {
                "@type": "ListItem",
                "item": "https://example.com/blog/test",
                "name": "Some other link",
                "position": 1,
              },
              {
                "@type": "ListItem",
                "item": "https://example.com/blog/test",
                "name": "Some other link",
                "position": 1,
              },
            ],
          },
        ]
      `)
    })
  })
})
