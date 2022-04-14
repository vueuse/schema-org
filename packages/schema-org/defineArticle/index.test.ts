import { expect } from 'vitest'
import { mockRoute, useSetup } from '../../.test'
import { useSchemaOrg } from '../useSchemaOrg'
import type { Article } from './index'
import { defineArticle } from './index'

describe('defineArticle', () => {
  it('can be registered', () => {
    useSetup(() => {
      useSchemaOrg([
        defineArticle({
          headline: 'test',
        }),
      ])

      const client = useSchemaOrg()

      expect(client.nodes).toMatchInlineSnapshot(`
        [
          {
            "@id": "#article",
            "@type": "Article",
            "headline": "test",
            "potentialAction": {
              "@type": "ReadAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://example.com/",
              },
            },
          },
        ]
      `)
    })
  })

  it('can be inherit attributes from useRoute()', () => {
    mockRoute({
      path: '/test',
      meta: {
        title: 'Article headline',
        description: 'my article description',
      },
    })

    useSetup(() => {
      const client = useSchemaOrg([
        defineArticle({}),
      ])

      const article = client.findNode<Article>('#article')

      expect(article?.headline).toEqual('Article headline')
      expect(article?.description).toEqual('my article description')

      expect(client.nodes).toMatchInlineSnapshot(`
        [
          {
            "@id": "#article",
            "@type": "Article",
            "description": "my article description",
            "headline": "Article headline",
            "potentialAction": {
              "@type": "ReadAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://example.com/",
              },
            },
          },
        ]
      `)
    })
  })
  // @todo test merging works
  // @todo test action works
})
