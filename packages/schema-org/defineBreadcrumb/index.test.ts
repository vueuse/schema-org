import { expect } from 'vitest'
import { useSetup } from '../../.test'
import { useSchemaOrg } from '../useSchemaOrg'
import type { BreadcrumbList } from '.'
import { PrimaryBreadcrumbId, defineBreadcrumb, defineBreadcrumbPartial } from '.'

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

      const { findNode } = useSchemaOrg()

      const breadcrumbs = findNode<BreadcrumbList>(PrimaryBreadcrumbId)

      expect(breadcrumbs).toMatchInlineSnapshot(`
        {
          "@id": "https://example.com/#breadcrumb",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "item": "https://example.com",
              "name": "Home",
            },
            {
              "@type": "ListItem",
              "item": "https://example.com/blog",
              "name": "Blog",
            },
            {
              "@type": "ListItem",
              "name": "My Article",
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

      const { idGraph } = useSchemaOrg()

      expect(idGraph.value).toMatchInlineSnapshot(`
        {
          "#breadcrumb": {
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
          "#subbreadcrumb": {
            "@id": "https://example.com/#subbreadcrumb",
            "@type": "BreadcrumbList",
            "custom": "test",
            "itemListElement": [
              {
                "@type": "ListItem",
                "item": "https://example.com/blog/test",
                "name": "Some other link",
              },
              {
                "@type": "ListItem",
                "item": "https://example.com/blog/test",
                "name": "Some other link",
              },
            ],
          },
        }
      `)
    })
  })
})
