import { expect } from 'vitest'
import { useSetup } from '../../.test'
import { injectSchemaOrg, useSchemaOrg } from '../useSchemaOrg'
import { definePerson } from '../definePerson'
import { IdentityId, idReference } from '../utils'
import type { WebSite } from './index'
import { WebSiteId, asSearchAction, defineWebSite } from './index'

describe('defineWebSite', () => {
  it('can be registered', () => {
    useSetup(() => {
      useSchemaOrg([
        defineWebSite({
          name: 'test',
        }),
      ])

      const client = injectSchemaOrg()

      expect(client.graphNodes).toMatchInlineSnapshot(`
        [
          {
            "@id": "https://example.com/#website",
            "@type": "WebSite",
            "inLanguage": "en-AU",
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

      const { findNode } = injectSchemaOrg()

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
          potentialAction: [
            asSearchAction({
              target: '/search?query={search_term_string}',
            }),
          ],
        }),
      ])

      const { findNode } = injectSchemaOrg()

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
              "urlTemplate": "https://example.com/search?query={search_term_string}",
            },
          },
        ]
      `)
      expect(website?.potentialAction).toBeDefined()
      // @ts-expect-error weird typing
      expect(website?.potentialAction?.[0]?.target.urlTemplate).toEqual('https://example.com/search?query={search_term_string}')
    })
  })
})
