import { expect } from 'vitest'
import { defineWebPage, defineWebPagePartial } from '../defineWebPage'
import { createMockClient, useSetup } from '../../.test'

describe('createSchemaOrg', () => {
  it('can be created', () => {
    const client = createMockClient()

    expect(client.canonicalHost).toEqual('https://example.com/')
    expect(client.graphNodes.length).toEqual(0)
  })

  it('can add nodes', () => {
    useSetup(() => {
      const client = createMockClient()

      client.addResolvedNodeInput([
        defineWebPagePartial(),
      ])

      expect(client.graphNodes).toMatchInlineSnapshot(`
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
      expect(client.graphNodes.length).toEqual(1)
    })
  })

  it('can remove nodes', () => {
    useSetup(() => {
      const client = createMockClient()

      client.addResolvedNodeInput([
        defineWebPage({
          '@id': '#my-webpage',
          'name': 'test',
        }),
      ])
      expect(client.graphNodes.length).toEqual(1)

      client.removeNode('#my-webpage')

      expect(client.graphNodes.length).toEqual(0)
    })
  })

  it('can find node', () => {
    useSetup(() => {
      const client = createMockClient()

      client.addResolvedNodeInput([
        defineWebPage({
          '@id': '#my-webpage',
          'name': 'test',
        }),
      ])

      const node = client.findNode('#my-webpage')

      expect(node?.['@id']).toEqual('https://example.com/#my-webpage')
    })
  })
})
