import { expect } from 'vitest'
import { defineWebPage } from '../defineWebPage'
import { createMockClient } from '../../.test'

describe('createSchemaOrg', () => {
  it('can be created', () => {
    const client = createMockClient()

    expect(client.canonicalHost).toEqual('example.com')
    expect(client.nodes.length).toEqual(0)
  })

  it('can add nodes', () => {
    const client = createMockClient()

    client.resolveAndMergeNodes([
      defineWebPage(),
    ])

    expect(client.graph.value).toMatchInlineSnapshot(`
      {
        "#webpage": {
          "@id": "#webpage",
          "@type": "WebPage",
          "url": "example.com",
        },
      }
    `)
    expect(client.nodes.length).toEqual(1)
  })

  it('can remove nodes', () => {
    const client = createMockClient()

    client.resolveAndMergeNodes([
      defineWebPage({
        '@id': '#my-webpage',
      }),
    ])
    expect(client.nodes.length).toEqual(1)

    client.removeNode('#my-webpage')

    expect(client.nodes.length).toEqual(0)
  })

  it('can find node', () => {
    const client = createMockClient()

    client.resolveAndMergeNodes([
      defineWebPage({
        '@id': '#my-webpage',
      }),
    ])

    const node = client.findNode('#my-webpage')

    expect(node?.['@id']).toEqual('#my-webpage')
  })

  it('can find node', () => {
    const client = createMockClient()

    client.resolveAndMergeNodes([
      defineWebPage({
        '@id': '#my-webpage',
      }),
    ])

    const node = client.findNode('#my-webpage')

    expect(node?.['@id']).toEqual('#my-webpage')
  })
})
