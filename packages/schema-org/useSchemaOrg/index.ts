import { inject, ref } from 'vue-demi'
import type { MaybeRef } from '@vueuse/shared'
import type { SchemaOrgNode } from '../types'
import type { SchemaOrgClient } from '../createSchemaOrg'
import { PROVIDE_KEY } from '../createSchemaOrg'
import {tryOnMounted} from "@vueuse/shared";

export function useSchemaOrg(nodes: MaybeRef<SchemaOrgNode>[] = [], options?: { replace: boolean; observe: boolean }): UseSchemaOrgReturn {
  const client = inject<SchemaOrgClient>(PROVIDE_KEY)

  if (!client)
    throw new Error('You may have forgotten to apply app.use(schemaOrg)')

  if (nodes.length) {
    nodes.forEach((node) => {
      client.addNode(ref(node))
    })
      client.update()
  }

  return client

  // options = defu(options || {}, { replace: false, observe: false })
  //
  // const schemaOrgGraph = schemaOrgClient.nodes
  //
  // const document = typeof window !== 'undefined' ? window.document : undefined
  //
  // const load = () => {
  //   console.log('document: ', !!document)
  //   if (document) {
  //     schemaOrgJsonLtd.value = document.head.querySelector(RootSchemaOrgGraphQuerySelector)
  //     console.log('doing with document ctx')
  //   }
  //
  //   schemaOrgGraph.value = [...nodes, ...JSON.parse(schemaOrgJsonLtd.value?.innerHTML || '[]')]
  //
  //   console.log('creating json ld tag')
  //   // schemaOrgJsonLtd.value = useJsonLdTag({
  //   //   '@context': 'https://schema.org',
  //   //   '@graph': schemaOrgGraph.value,
  //   // }, {
  //   //   attributes: {
  //   //     'data-hid': 'root-schema-org-graph',
  //   //   },
  //   // })
  //
  //   const meta = useSchemaOrgMeta()
  //
  //   console.log('head', useHead({}))
  //
  //   return meta.value?.head({
  //     // Can be static or computed
  //     script: [
  //       {
  //         type: 'application/ld+json',
  //         key: 'root-schema-org-graph',
  //         children: computed(() => JSON.stringify({
  //           '@context': 'https://schema.org',
  //           '@graph': schemaOrgGraph.value,
  //         }, undefined, 2)),
  //       },
  //     ],
  //   })
  // }

  // tryOnMounted(load)

  // @discover the tag & graph
  // return { graph: schemaOrgGraph, jsonLdTag: schemaOrgJsonLtd }

  // console.log('adding nodes', graphNodes)
  // if (!options.replace)
  // schemaOrgGraph.value = defu(graphNodes, schemaOrgGraph.value)
  // else
  // schemaOrgGraph.value = graphNodes

  // Every page should (attempt to) output the following pieces: Organization, WebSite, WebPage

  // @todo merge duplicate nodes

  // const graph: Thing[] = [
  //   defineWebSite(),
  //   defineWebPage(),
  // ]
  //
  // if (meta.value.identity)
  //   graph.unshift(meta.value.identity)

  // custom nodes
  // graph.push(...nodes)

  // create tag if we don't have a reference
  // if (!schemaOrgJsonLtd.value) {
  //   console.log('creating tag')
  //   const tag = useJsonLdTag({
  //     '@context': 'https://schema.org',
  //     '@graph': graphNodes,
  //   }, {
  //     attributes: {
  //       'data-hid': 'root-schema-org-graph',
  //     },
  //   })

  // schemaOrgJsonLtd.value = tag.scriptTag.value

  // if (options?.observe && document) {
  //   useMutationObserver(
  //     document.head?.querySelector('title'),
  //     () => {
  //       if (document && document.title !== title.value)
  //         title.value = titleTemplate.replace('%s', document.title)
  //     },
  //     { childList: true },
  //   )
  // }
}

export type UseSchemaOrgReturn = SchemaOrgClient
