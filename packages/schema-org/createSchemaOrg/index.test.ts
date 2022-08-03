import { expect } from 'vitest'
import { getCurrentInstance } from 'vue-demi'
import type { WebPage } from 'schema-org-graph-js'
import { PrimaryWebPageId, dedupeAndFlattenNodes, defineWebPage } from 'schema-org-graph-js'
import { createMockClient, getNodes, useSetup } from '../../.test'

describe('createSchemaOrg', () => {
  it('can be created', () => {
    useSetup(() => {
      const client = createMockClient()

      const vm = getCurrentInstance()!
      client.ctx._ctxUid = vm.uid

      expect(client.ctx.meta.canonicalHost).toEqual('https://example.com/')
      expect(client.ctx.nodes.length).toEqual(0)
    })
  })

  it('can add nodes', () => {
    useSetup(() => {
      const client = createMockClient()

      const vm = getCurrentInstance()!
      client.ctx._ctxUid = vm.uid

      client.ctx.addNode([
        defineWebPage(),
      ])

      const nodes = getNodes(client)

      expect(nodes).toMatchInlineSnapshot(`
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
      expect(nodes.length).toEqual(1)
    })
  })

  it('can remove nodes', () => {
    useSetup(() => {
      const client = createMockClient()

      const vm = getCurrentInstance()!
      client.ctx._ctxUid = vm.uid

      client.ctx.addNode([
        defineWebPage({
          '@id': '#my-webpage',
          'name': 'test',
        }),
      ])

      let nodes = getNodes(client)

      expect(nodes.length).toEqual(1)

      client.removeContext(vm.uid)

      nodes = getNodes(client)
      expect(nodes.length).toEqual(0)
    })
  })

  it('can find node', () => {
    useSetup(() => {
      const client = createMockClient()

      const vm = getCurrentInstance()!
      client.ctx._ctxUid = vm.uid

      client.ctx.addNode([
        defineWebPage({
          '@id': '#my-webpage',
          'name': 'test',
        }),
      ])

      const ctx = client.resolveGraph()

      const node = ctx.findNode('#my-webpage')

      expect(node?.['@id']).toEqual('https://example.com/#my-webpage')
    })
  })

  it('can handle hierarchy', () => {
    useSetup(() => {
      const client = createMockClient()

      const vm = getCurrentInstance()!
      client.ctx._ctxUid = vm.uid

      client.ctx.addNode([
        defineWebPage(),
      ])

      const ctx = client.resolveGraph()

      let node = ctx.findNode<WebPage>(PrimaryWebPageId)
      expect(node?.['@id']).toEqual('https://example.com/#webpage')
      expect(node?.name).toBeUndefined()
      expect(ctx.nodes.length).toEqual(1)

      ctx._ctxUid = 100

      client.ctx.addNode([
        defineWebPage({
          '@type': 'FAQPage',
          'name': 'FAQ',
        }),
      ])

      const dedupedNodes = dedupeAndFlattenNodes(client.resolveGraph().nodes)

      expect(dedupedNodes.length).toEqual(1)
      node = dedupedNodes[0]
      expect(node?.['@id']).toEqual('https://example.com/#webpage')
      expect(node?.name).toEqual('FAQ')
      expect(node?.['@type']).toEqual(['WebPage', 'FAQPage'])
    })
  })
})
