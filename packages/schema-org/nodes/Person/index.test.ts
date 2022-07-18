import { expect } from 'vitest'
import type { Article } from '@vueuse/schema-org'
import { PrimaryArticleId, defineArticle } from '@vueuse/schema-org'
import { useSetup } from '../../../.test'
import { injectSchemaOrg, useSchemaOrg } from '../../useSchemaOrg'
import { defineOrganization } from '../Organization'
import { definePerson } from './index'

describe('definePerson', () => {
  it('can be registered', () => {
    useSetup(() => {
      useSchemaOrg([
        definePerson({
          name: 'test',
          image: '/logo.png',
        }),
      ])

      const { graphNodes } = injectSchemaOrg()

      expect(graphNodes).toMatchInlineSnapshot(`
        [
          {
            "@id": "https://example.com/#/schema/image/1571960974",
            "@type": "ImageObject",
            "contentUrl": "https://example.com/logo.png",
            "inLanguage": "en-AU",
            "url": "https://example.com/logo.png",
          },
          {
            "@id": "https://example.com/#identity",
            "@type": "Person",
            "image": {
              "@id": "https://example.com/#/schema/image/1571960974",
            },
            "name": "test",
            "url": "https://example.com/",
          },
        ]
      `)
    })
  })

  it('will not create duplicate identities if one is provided', () => {
    useSetup(() => {
      useSchemaOrg([
        defineOrganization({
          name: 'test',
          logo: '/logo.png',
        }),
      ])

      useSchemaOrg([
        definePerson({
          name: 'harlan wilton',
        }),
      ])

      const client = injectSchemaOrg()
      expect(client.graphNodes[2]['@id']).toEqual('https://example.com/#/schema/person/3621006866')
    })
  })

  it('links as article author if article present', () => {
    useSetup(() => {
      useSchemaOrg([
        defineArticle({
          headline: 'test',
          description: 'test',
          image: '/img.png',
        }),
      ])

      const client = injectSchemaOrg()

      useSchemaOrg([
        definePerson({
          name: 'Author',
        }),
      ])

      const article = client.findNode<Article>(PrimaryArticleId)
      expect(article?.author).toMatchInlineSnapshot(`
        [
          {
            "@id": "https://example.com/#identity",
          },
        ]
      `)
    })
  })
})
