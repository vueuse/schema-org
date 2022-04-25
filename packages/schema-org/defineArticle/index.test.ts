import { expect } from 'vitest'
import { mockCreateSchemaOptions, mockRoute, useSetup } from '../../.test'
import { useSchemaOrg } from '../useSchemaOrg'
import type { WebPage } from '../defineWebPage'
import { defineWebPage } from '../defineWebPage'
import { defineOrganization } from '../defineOrganization'
import type { Article, ArticleUsingRouteMeta } from './index'
import { defineArticle } from './index'

const mockDate = new Date(Date.UTC(2021, 10, 10, 10, 10, 10, 0))

const defaultArticleInput = {
  headline: 'test',
  description: 'test',
  image: '/my-image.png',
  datePublished: new Date(Date.UTC(2021, 10, 10, 10, 10, 10, 0)),
  dateModified: new Date(Date.UTC(2021, 10, 10, 10, 10, 10, 0)),
}

describe('defineArticle', () => {
  it('can be registered', () => {
    useSetup(() => {
      useSchemaOrg([
        defineArticle(defaultArticleInput),
      ])

      const client = useSchemaOrg()

      expect(client.nodes).toMatchInlineSnapshot(`
        [
          {
            "@id": "https://example.com/#/schema/image/3248500182",
            "@type": "ImageObject",
            "contentUrl": "https://example.com/my-image.png",
            "inLanguage": "en-AU",
            "url": "https://example.com/my-image.png",
          },
          {
            "@id": "https://example.com/#article",
            "@type": "Article",
            "dateModified": "2021-11-10T10:10:10.000Z",
            "datePublished": "2021-11-10T10:10:10.000Z",
            "description": "test",
            "headline": "test",
            "image": {
              "@id": "https://example.com/#/schema/image/3248500182",
            },
            "inLanguage": "en-AU",
            "thumbnailUrl": "https://example.com/my-image.png",
          },
        ]
      `)
    })
  })

  it('inherits attributes from useRoute()', () => {
    mockRoute({
      path: '/test',
      meta: {
        title: 'Article headline',
        description: 'my article description',
        image: '/image.png',
        datePublished: mockDate,
        dateModified: mockDate,
      },
    }, () => {
      useSetup(() => {
        const client = useSchemaOrg([
          defineArticle<ArticleUsingRouteMeta>(),
        ])

        const article = client.findNode<Article>('#article')

        expect(article?.headline).toEqual('Article headline')
        expect(article?.description).toEqual('my article description')
        expect(article?.image).toEqual({
          '@id': 'https://example.com/#/schema/image/1656904464',
        })

        expect(client.nodes.length).toEqual(2)
        expect(client.nodes).toMatchInlineSnapshot(`
          [
            {
              "@id": "https://example.com/#/schema/image/1656904464",
              "@type": "ImageObject",
              "contentUrl": "https://example.com/image.png",
              "inLanguage": "en-AU",
              "url": "https://example.com/image.png",
            },
            {
              "@id": "https://example.com/test/#article",
              "@type": "Article",
              "dateModified": "2021-11-10T10:10:10.000Z",
              "datePublished": "2021-11-10T10:10:10.000Z",
              "description": "my article description",
              "headline": "Article headline",
              "image": {
                "@id": "https://example.com/#/schema/image/1656904464",
              },
              "inLanguage": "en-AU",
              "thumbnailUrl": "https://example.com/image.png",
            },
          ]
        `)
      })
    })
  })

  it('can define article with custom fields', () => {
    useSetup(() => {
      const client = useSchemaOrg([
        defineArticle({
          headline: 'test',
          datePublished: mockDate,
          description: 'test',
          // @ts-expect-error missing
          somethingNew: 'test',
        }),
      ])

      const article = client.findNode<Article & { somethingNew: string }>('#article')

      expect(article?.somethingNew).toEqual('test')
    })
  })

  it('passes Date objects into iso string', () => {
    useSetup(() => {
      const client = useSchemaOrg([
        defineArticle({
          ...defaultArticleInput,
          datePublished: new Date(Date.UTC(2021, 10, 1, 0, 0, 0)),
          dateModified: new Date(Date.UTC(2022, 1, 1, 0, 0, 0)),
        }),
      ])

      const article = client.findNode<Article>('#article')

      expect(article?.datePublished).toEqual('2021-11-01T00:00:00.000Z')
      expect(article?.dateModified).toEqual('2022-02-01T00:00:00.000Z')
    })
  })

  it('allows overriding the type', () => {
    useSetup(() => {
      const client = useSchemaOrg([
        defineArticle({
          '@type': 'TechArticle',
          ...defaultArticleInput,
          'datePublished': mockDate,
          'dateModified': mockDate,
        }),
      ])

      const article = client.findNode<Article>('#article')

      expect(article?.['@type']).toEqual(['Article', 'TechArticle'])
    })
  })

  it('adds read action to web page', () => {
    useSetup(() => {
      const client = useSchemaOrg([
        defineWebPage(),
        defineArticle(defaultArticleInput),
      ])

      const webpage = client.findNode<WebPage>('#webpage')

      expect(webpage?.potentialAction).toMatchInlineSnapshot(`
        [
          {
            "@type": "ReadAction",
            "target": [
              "https://example.com/",
            ],
          },
        ]
      `)
    })
  })

  it('clones date to web page', () => {
    useSetup(() => {
      const client = useSchemaOrg([
        defineWebPage(),
        defineArticle({
          '@id': '#my-article',
          ...defaultArticleInput,
          'datePublished': mockDate,
          'dateModified': mockDate,
        }),
      ])

      const webpage = client.findNode<WebPage>('#webpage')
      const article = client.findNode<Article>('#my-article')

      expect(webpage?.dateModified).toEqual(article?.dateModified)
      expect(webpage?.datePublished).toEqual(article?.datePublished)
    })
  })

  it('handles custom author', () => {
    useSetup(() => {
      const client = useSchemaOrg([
        defineWebPage(),
        defineArticle({
          ...defaultArticleInput,
          author: [
            {
              name: 'Harlan Wilton',
              url: 'https://harlanzw.com',
            },
          ],
        }),
      ])

      const articleNode = client.findNode<Article>('#article')

      // @ts-expect-error untyped
      const id = articleNode.author['@id']

      expect(id).toEqual('https://example.com/#/schema/person/1230192103')

      const person = client.findNode('https://example.com/#/schema/person/1230192103')
      expect(person).toMatchInlineSnapshot(`
        {
          "@id": "https://example.com/#/schema/person/1230192103",
          "@type": "Person",
          "name": "Harlan Wilton",
          "url": "https://harlanzw.com",
        }
      `)
    })
  })

  it('handles custom authors', () => {
    useSetup(() => {
      const client = useSchemaOrg([
        defineWebPage(),
        defineArticle({
          ...defaultArticleInput,
          author: [
            {
              name: 'John doe',
              url: 'https://harlanzw.com',
            },
            {
              name: 'Jane doe',
              url: 'https://harlanzw.com',
            },
          ],
        }),
      ])

      const articleNode = client.findNode<Article>('#article')

      // @ts-expect-error untyped
      expect(articleNode.author.length).toEqual(2)

      expect(client.nodes).toMatchInlineSnapshot(`
        [
          {
            "@id": "https://example.com/#/schema/image/3248500182",
            "@type": "ImageObject",
            "contentUrl": "https://example.com/my-image.png",
            "inLanguage": "en-AU",
            "url": "https://example.com/my-image.png",
          },
          {
            "@id": "https://example.com/#/schema/person/1870976560",
            "@type": "Person",
            "name": "John doe",
            "url": "https://harlanzw.com",
          },
          {
            "@id": "https://example.com/#/schema/person/2970758057",
            "@type": "Person",
            "name": "Jane doe",
            "url": "https://harlanzw.com",
          },
          {
            "@id": "https://example.com/#webpage",
            "@type": "WebPage",
            "dateModified": "2021-11-10T10:10:10.000Z",
            "datePublished": "2021-11-10T10:10:10.000Z",
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
          {
            "@id": "https://example.com/#article",
            "@type": "Article",
            "author": [
              {
                "@id": "https://example.com/#/schema/person/1870976560",
              },
              {
                "@id": "https://example.com/#/schema/person/2970758057",
              },
            ],
            "dateModified": "2021-11-10T10:10:10.000Z",
            "datePublished": "2021-11-10T10:10:10.000Z",
            "description": "test",
            "headline": "test",
            "image": {
              "@id": "https://example.com/#/schema/image/3248500182",
            },
            "inLanguage": "en-AU",
            "isPartOf": {
              "@id": "https://example.com/#webpage",
            },
            "mainEntityOfPage": {
              "@id": "https://example.com/#webpage",
            },
            "thumbnailUrl": "https://example.com/my-image.png",
          },
        ]
      `)
    })
  })

  it('can match yoast schema', () => {
    mockCreateSchemaOptions({
      canonicalHost: 'https://kootingalpecancompany.com/',
      defaultLanguage: 'en-US',
      // @ts-expect-error mock untyped
      useRoute: () => ({
        path: '/pecan-tree-kootingal',
        meta: {
          title: 'The pecan tree &#8220;Carya illinoinensis&#8221;',
          image: 'https://res.cloudinary.com/kootingalpecancompany/images/w_1920,h_2560/f_auto,q_auto/v1648723707/IMG_0446/IMG_0446.jpg?_i=AA',
        },
      }),
    })
    useSetup(() => {
      useSchemaOrg([
        defineOrganization({
          name: 'Kootingal Pecan Company',
          logo: 'test',
        }),
        defineWebPage(),
      ])

      useSchemaOrg([
        defineArticle<ArticleUsingRouteMeta>({
          wordCount: 381,
          datePublished: '2022-04-06T08:00:51+00:00',
          dateModified: '2022-04-06T08:00:53+00:00',
          author: {
            '@id': '#/schema/person/13c25c1e03aefc2d21fbd03df3d17432',
            'name': 'Mark BT',
          },
          thumbnailUrl: 'https://res.cloudinary.com/kootingalpecancompany/images/w_1920,h_2560/f_auto,q_auto/v1648723707/IMG_0446/IMG_0446.jpg?_i=AA',
          keywords: [
            'certified organic pecans',
            'Kootingal',
            'Orchard',
            'organic nuts',
            'Pecan tree',
          ],
          articleSection: [
            'Organic pecans, activated pecans, single source, Australian organic pecans',
            'Pecan tree',
          ],
        }),
      ])

      const { findNode } = useSchemaOrg()

      expect(findNode('#article')).toEqual({
        '@type': 'Article',
        '@id': 'https://kootingalpecancompany.com/pecan-tree-kootingal/#article',
        'isPartOf': {
          '@id': 'https://kootingalpecancompany.com/pecan-tree-kootingal/#webpage',
        },
        'author': {
          '@id': 'https://kootingalpecancompany.com/#/schema/person/13c25c1e03aefc2d21fbd03df3d17432',
        },
        'headline': 'The pecan tree &#8220;Carya illinoinensis&#8221;',
        'dateModified': '2022-04-06T08:00:53.000Z',
        'datePublished': '2022-04-06T08:00:51.000Z',
        'mainEntityOfPage': {
          '@id': 'https://kootingalpecancompany.com/pecan-tree-kootingal/#webpage',
        },
        'wordCount': 381,
        'publisher': {
          '@id': 'https://kootingalpecancompany.com/#identity',
        },
        'image': {
          '@id': 'https://kootingalpecancompany.com/pecan-tree-kootingal/#primaryimage',
        },
        'thumbnailUrl': 'https://res.cloudinary.com/kootingalpecancompany/images/w_1920,h_2560/f_auto,q_auto/v1648723707/IMG_0446/IMG_0446.jpg?_i=AA',
        'keywords': [
          'certified organic pecans',
          'Kootingal',
          'Orchard',
          'organic nuts',
          'Pecan tree',
        ],
        'articleSection': [
          'Organic pecans, activated pecans, single source, Australian organic pecans',
          'Pecan tree',
        ],
        'inLanguage': 'en-US',
      })
    })
  })
})
