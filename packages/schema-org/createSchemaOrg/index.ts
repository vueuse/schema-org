import type { App } from 'vue'
import type { Ref } from 'vue-demi'
import { computed, ref, unref } from 'vue-demi'
import { joinURL, withProtocol, withTrailingSlash } from 'ufo'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import type { ConsolaLogObject } from 'consola'
import { createDefu, defu } from 'defu'
import type { Id, IdGraph, SchemaNode, Thing } from '../types'
import type { ResolvedNodeResolver } from '../utils'
import { IdentityId, resolveRawId } from '../utils'
import type { Organization } from '../defineOrganization'
import type { UseSchemaOrgInput } from '../useSchemaOrg'

export const PROVIDE_KEY = 'schemaorg'

type UseHead = (data: Record<string, any>) => void

export interface SchemaOrgClient {
  install: (app: App) => void
  idGraph: Ref<IdGraph>
  // alias function of graph
  nodes: SchemaNode[]
  schemaOrg: string

  // node util functions
  mergeNode: <T extends SchemaNode = SchemaNode, I extends Partial<SchemaNode> = Partial<SchemaNode>>(node: T, partial: I) => T
  addNode: <T extends SchemaNode = SchemaNode>(node: T) => T
  removeNode: (node: SchemaNode|Id) => void
  update: () => void
  findNode: <T extends SchemaNode = SchemaNode>(id: Id) => T|undefined
  resolveAndMergeNodes(nodes: UseSchemaOrgInput[]): void

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
  head?: HeadClient | any
  useRoute?: () => RouteLocationNormalizedLoaded | VitePressUseRoute
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
  /**
   * Should Schema.org data be inferred from route meta
   * @default true
   */
  inferSchemaFromRouteMeta?: boolean
}

export type CreateSchemaOrgInput = SchemaOrgOptions & FrameworkAugmentationOptions

type ConsolaFn = (message: ConsolaLogObject | any, ...args: any[]) => void

export const createSchemaOrg = (options: CreateSchemaOrgInput) => {
  options = defu(options, {
    inferSchemaFromRouteMeta: true,
    debug: false,
    defaultLanguage: 'en',
  })
  const idGraph: Ref<IdGraph> = ref({})

  let debug: ConsolaFn|((...arg: any) => void) = () => {}
  let warn: ConsolaFn|((...arg: any) => void) = () => {}
  try {
    import('consola').then((consola) => {
      const logger = consola.default.withScope('@vueuse/schema-org')
      if (options.debug) {
        logger.level = 4
        debug = logger.debug
      }
      warn = logger.warn
    }).catch()
  }
    // optional consola dependency
  catch (e) {}
  //
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
      if (!options.inferSchemaFromRouteMeta)
        return {}
      if (options.customRouteMetaResolver)
        return options.customRouteMetaResolver()
      if (!options.useRoute)
        return {}
      const route = options.useRoute()
      // @ts-expect-error multiple router implementations
      const meta = route.meta ?? {}
      // if route meta is missing some data, we can try and fill it using the document, if available
      if (typeof document !== 'undefined') {
        if (!meta.title)
          meta.title = document.title || undefined
        if (!meta.description)
          meta.description = document.querySelector('meta[name="description"]')?.getAttribute('content') || undefined
      }
      return meta
    },

    resolveAndMergeNodes(resolvers) {
      // unref all nodes firstly
      const unrefedResolvers = resolvers.map(resolver => unref(resolver))
      // add raw nodes
      // @ts-expect-error not sure a better way to type check
      const rawNodes = unrefedResolvers.filter(resolver => typeof resolver.definition === 'undefined') as Thing[]
      rawNodes.forEach(node => client.addNode(node))
      // @ts-expect-error not sure a better way to type check
      const resolverNodes = unrefedResolvers.filter(resolver => typeof resolver.definition !== 'undefined') as ResolvedNodeResolver<any>[]
      // add (or merging) new nodes into our schema graph
      resolverNodes
        // resolve each node
        .filter((resolver) => {
          // if we're patching data we need to resolve the id and check for a duplicate node
          if (resolver.options?.strategy !== 'patch')
            return true
          const id = resolver.resolveId()
          // handle duplicate ids, strategy is merge the partial data, no resolving
          const existingNode = client.findNode(id)
          if (existingNode) {
            client.mergeNode(existingNode, resolver.resolve())
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

    findNode<T extends SchemaNode = SchemaNode>(id: Id) {
      const key = id.substr(id.lastIndexOf('#')) as Id
      // help find the logo
      if (key === '#logo' && !idGraph.value[key] && idGraph.value[IdentityId])
        return (idGraph.value[IdentityId] as Organization).logo as T|undefined
      return idGraph.value[key] as T|undefined
    },

    get canonicalHost() {
      // use window if the host has not been provided
      if (!options.canonicalHost && typeof window !== 'undefined')
        return `${window.location.protocol}//${window.location.host}`
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

    mergeNode(node, data) {
      const merger = createDefu((obj, key, value) => {
        if (!Array.isArray(obj[key]))
          return
        const set = new Set<any>()
        const data = (Array.isArray(value) ? value : [value])as any[]
        [...obj[key], ...data].forEach((v: any) => {
          set.add(JSON.stringify(v))
        })
        // @ts-expect-error untyped
        obj[key] = [...set.values()].map(v => JSON.parse(v))
        return true
      })
      return client.addNode(merger(data, node) as typeof node)
    },

    addNode(node) {
      const key = resolveRawId(node)
      idGraph.value[key] = node
      return idGraph.value[key] as typeof node
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

    setupDOM() {
      let head: HeadClient | null = null
      try {
        // head may not be available in SSR (vitepress)
        head = options.head || injectHead()
      }
      catch (e) {
        debug('DOM setup failed, couldn\'t fetch injectHead')
      }
      if (!head)
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
