import type { App } from 'vue'
import type { Ref } from 'vue-demi'
import { computed, ref, unref } from 'vue-demi'
import { joinURL } from 'ufo'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { defu } from 'defu'
import type { MaybeRef } from '@vueuse/shared'
import type { Id, IdGraph, SchemaOrgNode, Thing } from '../types'
import type { SchemaOrgNodeResolver } from '../utils'

export const PROVIDE_KEY = 'useschemaorg'

type UseHead = (data: Record<string, any>) => void

export interface SchemaOrgClient {
  install: (app: App) => void
  graph: Ref<IdGraph>
  nodes: SchemaOrgNode[]
  addNode: (node: SchemaOrgNode) => void
  removeNode: (node: SchemaOrgNode|Id) => void
  update: (document?: Document) => void
  findNode: <T extends SchemaOrgNode>(id: Id) => T|null

  // util functions
  resolvePathId: (id: string, path?: string) => string
  resolveHostId: (id: string) => string
  routeCanonicalUrl: (path?: string) => string
  routeMeta: () => Record<string, unknown>
  // meta
  canonicalHost: string
  options: SchemaOrgOptions

  resolveAndMergeNodes(resolvers: MaybeRef<SchemaOrgNodeResolver<any>>[]): void
}

export interface SchemaOrgOptions {
  useHead: UseHead
  useRoute: () => RouteLocationNormalizedLoaded
  canonicalHost?: string
  defaultLanguage?: string
}

export const createSchemaOrg = (options: SchemaOrgOptions) => {
  const idGraph: Ref<IdGraph> = ref({})

  if (!options.useHead)
    throw new Error('Missing useHead implementation from createSchemaOrg constructor.')

  if (!options.useRoute)
    throw new Error('Missing useRoute implementation from createSchemaOrg constructor.')

  const client: SchemaOrgClient = {
    install(app) {
      app.config.globalProperties.$schemaOrg = client
      app.provide(PROVIDE_KEY, client)
    },

    options,

    routeMeta() {
      return options.useRoute().meta
    },

    resolveAndMergeNodes(resolvers: MaybeRef<SchemaOrgNodeResolver<any>>[]) {
      // add (or merging) new nodes into our schema graph
      resolvers
        // resolve each node
        .map((resolver) => {
          resolver = unref(resolver)
          // create node with defaults
          const node = defu(resolver.nodePartial, resolver.definition?.defaults || {}) as Thing
          // allow the node to resolve itself
          if (resolver.definition.resolve)
            resolver.definition.resolve(node, client)
          return {
            node,
            resolver,
          }
        })
        // then add them to the id graph, merging duplicate nodes
        .map(({ node, resolver }) => {
          // handle duplicate ids, default strategy is merge
          const existingNode = client.graph.value?.[node['@id']]
          if (existingNode) {
            client.removeNode(existingNode)
            node = defu(node, existingNode)
          }
          client.addNode(node)
          return {
            node,
            resolver,
          }
        })
        // finally, we need to allow each node to merge in relations from the idGraph
        .forEach(({ node, resolver }) => {
          if (resolver.definition.mergeRelations)
            resolver.definition.mergeRelations(node, client)
        })
    },

    get graph() {
      return idGraph
    },

    get nodes() {
      return Object.values(idGraph.value)
    },

    findNode(id: Id) {
      return idGraph.value[id] || null
    },

    get canonicalHost() {
      // use window if the host has not been provided
      if (!options.canonicalHost && typeof window !== 'undefined')
        return window.location.host
      return options.canonicalHost || ''
    },

    routeCanonicalUrl(path?: string) {
      // @todo check document meta for canonical url specification
      const route = options.useRoute()
      return joinURL(client.canonicalHost, route.path, path || '')
    },

    resolveHostId(id: string, path?: string) {
      if (path)
        return `${path}#${id}`
      return `${client.canonicalHost}#${id}`
    },

    resolvePathId(id: string, path?: string) {
      if (path)
        return `${path}#${id}`
      return `${client.routeCanonicalUrl()}#${id}`
    },

    addNode(node) {
      idGraph.value[node['@id']] = node
    },

    removeNode(node) {
      delete idGraph.value[typeof node === 'string' ? node : node['@id']]
    },

    update() {
      return client.options.useHead({
        // Can be static or computed
        script: [
          {
            type: 'application/ld+json',
            key: 'root-schema-org-graph',
            children: computed(() => JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': client.nodes,
            }, undefined, 2)),
          },
        ],
      })
    },
  }
  return client
}
