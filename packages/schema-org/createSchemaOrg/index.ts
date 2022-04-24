import type { App } from 'vue'
import type { Ref } from 'vue-demi'
import { computed, ref, unref } from 'vue-demi'
import { joinURL, withProtocol, withTrailingSlash } from 'ufo'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import type { ConsolaLogObject } from 'consola'
import { defu } from 'defu'
import type { Id, IdGraph, MaybeRef, SchemaOrgNode, Thing } from '../types'
import type { NodeResolver } from '../utils'
import {IdentityId} from "../utils";
import {Organization} from "../defineOrganization";

export const PROVIDE_KEY = 'useschemaorg'

type UseHead = (data: Record<string, any>) => void

export interface SchemaOrgClient {
  install: (app: App) => void
  idGraph: Ref<IdGraph>
  // alias function of graph
  nodes: SchemaOrgNode[]
  schemaOrg: string

  // node util functions
  addNode: (node: SchemaOrgNode|Partial<SchemaOrgNode>) => SchemaOrgNode|false
  removeNode: (node: SchemaOrgNode|Id) => void
  update: () => void
  findNode: <T extends SchemaOrgNode = SchemaOrgNode>(id: Id) => T|undefined
  resolveAndMergeNodes(resolvers: MaybeRef<NodeResolver<any>|Thing|Record<string, any>>[]): void

  // meta
  currentRouteMeta: Record<string, unknown>
  canonicalHost: string
  canonicalUrl: string
  options: CreateSchemaOrgInput
}

interface VitePressUseRoute {
  path: string
  data: {}
}

export interface FrameworkAugmentationOptions {
  // framework specific helpers
  useHead?: UseHead|false
  useRoute?: () => RouteLocationNormalizedLoaded|VitePressUseRoute
  customRouteMetaResolver?: () => Record<string, unknown>
}

export interface SchemaOrgOptions {
  /**
   * The production URL of your site. This allows the client to generate all URLs for you and is important to set correctly.
   */
  canonicalHost?: string
  /**
   * Will set the `isLanguage` to this value for any Schema which uses it. Should be a valid language code, i.e `en-AU`
   */
  defaultLanguage?: string
  /**
   * Will set the `priceCurrency` for [Product](/schema/product) Offer Schema. Should be a valid currency code, i.e `AUD`
   */
  defaultCurrency?: string
  /**
   * Will enable debug logs to be shown.
   */
  debug?: boolean
}

export type CreateSchemaOrgInput = SchemaOrgOptions & FrameworkAugmentationOptions

type ConsolaFn = (message: ConsolaLogObject | any, ...args: any[]) => void

export const createSchemaOrg = (options: CreateSchemaOrgInput) => {
  const idGraph: Ref<IdGraph> = ref({})

  let debug: ConsolaFn|((...arg: any) => void) = () => {}
  let warn: ConsolaFn|((...arg: any) => void) = () => {}
  import('consola').then((consola) => {
    const logger = consola.default.withScope('vue-schema-org')
    if (options.debug) {
      logger.level = 4
      debug = logger.debug
    }
    warn = logger.warn
  })

  if (!options.useHead && options.useHead !== false)
    warn('Missing useHead implementation. Provide a `useHead` handler, usually from `@vueuse/head`.')

  if (!options.useRoute)
    warn('Missing useRoute implementation. Provide a `useRoute` handler, usually from `vue-router`.')

  if (!options.canonicalHost) {
    warn('Missing required `canonicalHost` from `createSchemaOrg`.')
  }
  else {
    // all urls should look like https://example.com/
    options.canonicalHost = withTrailingSlash(withProtocol(options.canonicalHost, 'https://'))
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
        .filter((resolver) => {
          const id = resolver.resolveId()
          // handle duplicate ids, strategy is merge the partial data, no resolving
          const existingNode = client.findNode(id)
          if (existingNode) {
            client.addNode({
              '@id': existingNode['@id'],
              ...resolver.nodePartial,
            })
            return false
          }
          return true
        })
        .map((resolver) => {
          resolver = unref(resolver)
          const node = resolver.resolve()
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

    idGraph,

    get nodes() {
      return Object.values(idGraph.value)
    },

    findNode<T extends SchemaOrgNode = SchemaOrgNode>(id: Id) {
      const key = id.substr(id.lastIndexOf('#')) as Id
      // help find the logo
      if (key === '#logo' && !idGraph.value[key] && idGraph.value[IdentityId])
        return (idGraph.value[IdentityId] as Organization).logo as T|undefined
      return idGraph.value[key] as T|undefined
    },

    get canonicalHost() {
      // use window if the host has not been provided
      if (!options.canonicalHost && typeof window !== 'undefined')
        return window.location.host
      return options.canonicalHost || ''
    },

    get canonicalUrl() {
      let route: { path: string }|null = null
      if (options.useRoute)
        route = options.useRoute()
      else if (typeof window !== 'undefined')
        route = { path: window.location.pathname }
      return joinURL(client.canonicalHost, route?.path || '')
    },

    addNode(node) {
      if (!node['@id']) {
        warn('Adding root level node without an @id', node)
        return false
      }
      const key = node['@id'].substr(node['@id'].lastIndexOf('#')) as Id
      // handle duplicates with a merge
      if (idGraph.value[key])
        node = defu(node, idGraph.value[key]) as SchemaOrgNode
      idGraph.value[key] = node as SchemaOrgNode
      return idGraph.value[key]
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
        warn('Updating without a useHead implementation.')
        return
      }
      if (!client.nodes.length) {
        debug('No nodes to patch, skipping')
        return
      }
      debug('Updating meta using useHead implementation.', { nodes: client.nodes.length })
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
