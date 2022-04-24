import type { App } from 'vue'
import type { Ref } from 'vue-demi'
import { computed, ref, unref } from 'vue-demi'
import { joinURL } from 'ufo'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { defu } from 'defu'
import type { Id, IdGraph, MaybeRef, SchemaOrgNode, Thing } from '../types'
import type { NodeResolver } from '../utils'

export const PROVIDE_KEY = 'useschemaorg'

type UseHead = (data: Record<string, any>) => void

export interface SchemaOrgClient {
  install: (app: App) => void
  graph: Ref<IdGraph>
  // alias function of graph
  nodes: SchemaOrgNode[]
  schemaOrg: string

  // node util functions
  addNode: (node: SchemaOrgNode) => void
  removeNode: (node: SchemaOrgNode|Id) => void
  update: (document?: Document) => void
  findNode: <T extends SchemaOrgNode = SchemaOrgNode>(id: Id) => T|undefined
  resolveAndMergeNodes(resolvers: MaybeRef<NodeResolver<any>|Thing|Record<string, any>>[]): void

  // meta
  currentRouteMeta: Record<string, unknown>
  canonicalHost: string
  canonicalUrl: string
  options: SchemaOrgOptions
}

interface VitePressUseRoute {
  path: string
  data: {}
}

export interface SchemaOrgOptions {
  useHead?: UseHead|false
  useRoute?: () => RouteLocationNormalizedLoaded|VitePressUseRoute
  customRouteMetaResolver?: () => Record<string, unknown>
  canonicalHost?: string
  defaultLanguage?: string
  defaultCurrency?: string
}

export const createSchemaOrg = (options: SchemaOrgOptions) => {
  const idGraph: Ref<IdGraph> = ref({})

  if (!options.useHead && options.useHead !== false) {
    try {
      // try resolve the dependency ourselves
      import('@vueuse/head')
        .then(({ useHead }) => {
          options.useHead = useHead
        })
    }
    catch (e) {
      console.warn('[vue-schema-org] Failed to resolve useHead implementation. Either provide a `useHead` handler or install `@vueuse/head`.')
    }
  }

  if (!options.useRoute) {
    try {
      // try resolve the dependency ourselves
      import('vue-router')
        .then(({ useRoute }) => {
          options.useRoute = useRoute
        })
    }
    catch (e) {
      console.warn('[vue-schema-org] Failed to resolve useRoute implementation. Either provide a `useRoute` handler or install `vue-router`.')
    }
  }

  const client: SchemaOrgClient = {
    install(app) {
      app.config.globalProperties.$schemaOrg = client
      app.provide(PROVIDE_KEY, client)
    },

    options,

    get currentRouteMeta() {
      if (options.customRouteMetaResolver)
        return options.customRouteMetaResolver()
      if (!options.useRoute)
        return {}
      const route = options.useRoute()
      // @ts-expect-error multiple router implementations
      return route.meta ?? {}
    },

    resolveAndMergeNodes(resolvers) {
      // unref all nodes firstly
      const unrefedResolvers = resolvers.map(resolver => unref(resolver))
      // add raw nodes
      // @ts-expect-error not sure a better way to type check
      const rawNodes = unrefedResolvers.filter(resolver => typeof resolver.definition === 'undefined') as Thing[]
      rawNodes.forEach(node => client.addNode(node))
      // @ts-expect-error not sure a better way to type check
      const resolverNodes = unrefedResolvers.filter(resolver => typeof resolver.definition !== 'undefined') as NodeResolver<any>[]
      // add (or merging) new nodes into our schema graph
      resolverNodes
        // resolve each node
        .map((resolver) => {
          resolver = unref(resolver)
          return {
            node: resolver.resolve(),
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

    findNode<T extends SchemaOrgNode = SchemaOrgNode>(id: Id) {
      return idGraph.value[id] as T|undefined
    },

    get canonicalHost() {
      // use window if the host has not been provided
      if (!options.canonicalHost && typeof window !== 'undefined')
        return window.location.host
      return options.canonicalHost || ''
    },

    get canonicalUrl() {
      // @todo check document meta for canonical url specification
      let route: { path: string }|null = null
      if (options.useRoute)
        route = options.useRoute()
      else if (typeof window !== 'undefined')
        route = { path: window.location.pathname }
      return joinURL(client.canonicalHost, route?.path || '')
    },

    addNode(node) {
      const key = node['@id'].substr(node['@id'].lastIndexOf('#')) as Id
      idGraph.value[key] = node
    },

    removeNode(node) {
      delete idGraph.value[typeof node === 'string' ? node : node['@id']]
    },

    get schemaOrg() {
      return JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': client.nodes,
      }, undefined, 2)
    },

    update() {
      if (!client.options.useHead) {
        // debug('[vue-schema-org] Updating without a useHead implementation.')
        return
      }
      client.options.useHead({
        // Can be static or computed
        script: [
          {
            type: 'application/ld+json',
            key: 'root-schema-org-graph',
            children: computed(() => client.schemaOrg),
          },
        ],
      })
    },
  }
  return client
}
