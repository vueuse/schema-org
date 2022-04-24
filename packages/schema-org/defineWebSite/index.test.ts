import { expect } from 'vitest'
import { useSetup } from '../../.test'
import { useSchemaOrg } from '../useSchemaOrg'
import { definePerson } from '../definePerson'
import { IdentityId, idReference } from '../utils'
import type { WebSite } from './index'
import { WebSiteId, defineWebSite } from './index'

describe('defineWebSite', () => {
  it('can be registered', () => {
    useSetup(() => {
      useSchemaOrg([
        defineWebSite({
          name: 'test',
        }),
      ])

      const client = useSchemaOrg()

      expect(client.nodes).toMatchInlineSnapshot(`
        [
          {
            "@id": "https://example.com/#website",
            "@type": "WebSite",
            "name": "test",
            "url": "https://example.com/",
          },
        ]
      `)
    })
  })

  it('sets up publisher as identity', () => {
    useSetup(() => {
      useSchemaOrg([
        definePerson({
          name: 'Harlan Wilton',
          image: '/image/me.png',
        }),
        defineWebSite({
          name: 'test',
        }),
      ])

      const { findNode } = useSchemaOrg()

      const website = findNode<WebSite>(WebSiteId)
      const identity = findNode<WebSite>(IdentityId)

      expect(website?.publisher).toEqual(idReference(identity!))
    })
  })

  it('can set search action', () => {
    useSetup(() => {
      useSchemaOrg([
        defineWebSite({
          name: 'test',
        })
          .withSearchAction({
            target: '/search={search_term_string}',
          }),
      ])

      const { findNode } = useSchemaOrg()

      const website = findNode<WebSite>(WebSiteId)

      expect(website?.potentialAction).toMatchInlineSnapshot(`
        [
          {
            "@type": "SearchAction",
            "query-input": {
              "@type": "PropertyValueSpecification",
              "valueName": "search_term_string",
              "valueRequired": true,
            },
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://example.com/search={search_term_string}",
            },
          },
        ]
      `)
      expect(website?.potentialAction).toBeDefined()
      // @ts-expect-error weird typing
      expect(website?.potentialAction?.[0]?.target.urlTemplate).toEqual('https://example.com/search={search_term_string}')
    })
  })
})
