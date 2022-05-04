import type { App } from 'vue'
import type { ComponentInternalInstance, Ref } from 'vue-demi'
import { joinURL, withProtocol, withTrailingSlash } from 'ufo'
import type { ConsolaLogObject } from 'consola'
import { defu } from 'defu'
import { hash } from 'ohash'
import { computed, getCurrentInstance, onMounted, reactive, readonly, ref, unref, watchEffect } from 'vue-demi'
import type { HeadClient } from '@vueuse/head'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { injectHead } from '@vueuse/head'
import type { Arrayable, Id, IdGraph, SchemaNode } from '../types'
import { prefixId, resolveRawId } from '../utils'
import type { UseSchemaOrgInput } from '../useSchemaOrg'

export const PROVIDE_KEY = 'schemaorg'

export interface SchemaOrgClient {
  install: (app: App) => void
  graphNodes: SchemaNode[]
  schemaRef: Ref<string>

  // node util functions
  addNode: <T extends SchemaNode>(node: T, ctx: InstanceContext) => Id
  removeNode: (node: SchemaNode | Id | string, ctx: InstanceContext) => void
  removeContext: (ctx: InstanceContext) => void
  setupDOM: () => void
  findNode: <T extends SchemaNode>(id: Id) => T | null
  addResolvedNodeInput(ctx: InstanceContext, nodes: Arrayable<UseSchemaOrgInput>): Set<Id>

  generateSchema: () => void
  debug: ConsolaFn | ((...arg: any) => void)

  setupRouteContext: (vm: ComponentInternalInstance) => InstanceContext
  options: CreateSchemaOrgInput
}

export interface FrameworkAugmentationOptions {
  // framework specific helpers
  head?: HeadClient | any
  useRoute: () => RouteLocationNormalizedLoaded
  provider?: 'vitepress' | 'nuxt' | 'vitesse' | string
}

export type SchemaOrgContext = SchemaOrgClient & InstanceContext

export interface InstanceContext {
  canonicalHost: string
  canonicalUrl: string
  uid: number
  meta: Record<string, any>
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
  options = defu(options, {
    debug: false,
    defaultLanguage: 'en',
  })
  const idGraph: IdGraph = {}
  const schemaRef = ref<string>('')

  // eslint-disable-next-line no-console
  let debug: ConsolaFn | ((...arg: any) => void) = (...arg: any) => { options.debug && console.debug(...arg) }
  // eslint-disable-next-line no-console
  let warn: ConsolaFn | ((...arg: any) => void) = (...arg: any) => { console.warn(...arg) }
  // opt-in to consola if available
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
  // if consola is missing it's not a problem
  catch (e) {}
  //
  if (!options.useRoute)
    warn('Missing useRoute implementation. Provide a `useRoute` handler, usually from `vue-router`.')

  if (!options.canonicalHost) {
    warn('Missing required `canonicalHost` from `createSchemaOrg`.')
  }
  else {
    // all urls should be fully qualified, such as https://example.com/
    options.canonicalHost = withTrailingSlash(withProtocol(options.canonicalHost, 'https://'))
  }

  let _domSetup = false

  const client: SchemaOrgClient = {
    install(app) {
      app.config.globalProperties.$schemaOrg = client
      app.provide(PROVIDE_KEY, client)
    },

    debug,
    schemaRef,
    options,

    setupRouteContext(vm: ComponentInternalInstance) {
      const host = options.canonicalHost || ''
      const route = options.useRoute()

      const ctx = reactive<InstanceContext>({
        meta: {},
        canonicalHost: host,
        canonicalUrl: '',
        uid: vm.uid,
      })

      watchEffect(() => {
        ctx.canonicalUrl = joinURL(host, route.path)

        if (options.provider === 'vitepress') {
          const vitepressData = (route as typeof route & { data: any }).data
          ctx.meta = {
            ...vitepressData,
            ...vitepressData.frontmatter,
          }
        }
        else {
          ctx.meta = route.meta || {}
        }
      })

      // if we have access to the instance
      if (getCurrentInstance()) {
        onMounted(() => {
          if (!ctx.canonicalHost)
            ctx.canonicalHost = `${window.location.protocol}//${window.location.host}`

          // if route meta is missing some data, we can try and fill it using the document, if available
          if (!ctx.meta.title)
            ctx.meta.title = document.title || undefined
          if (!ctx.meta.description)
            ctx.meta.description = document.querySelector('meta[name="description"]')?.getAttribute('content') || undefined
          if (!ctx.meta.image)
            ctx.meta.description = document.querySelector('meta[property="og:image"]')?.getAttribute('content') || undefined
          // Note: this will trigger the schema to be re-generated if a value changes
        })
      }

      return ctx
    },

    addResolvedNodeInput(routeCtx, nodes) {
      nodes = (Array.isArray(nodes) ? nodes : [nodes]) as UseSchemaOrgInput[]

      const ctx = {
        ...client,
        ...readonly(routeCtx),
      }
      const addedNodes = new Set<Id>()
      const resolvedNodes = nodes
        .map((n: any) => {
          if (typeof n.resolve !== 'undefined') {
            return {
              ...n,
              node: reactive(n.resolve(ctx)),
            }
          }
          if (!n['@id'])
            n['@id'] = prefixId(ctx.canonicalHost, `#${hash(n)}`)
          return {
            node: reactive(n),
          }
        })
      // add the nodes
      resolvedNodes.forEach(({ node }: any) => {
        addedNodes.add(client.addNode(node, routeCtx))
      })
      // finally, we need to allow each node to merge in relations from the idGraph
      resolvedNodes.forEach((n: any) => {
        if (n.definition?.mergeRelations)
          n.definition.mergeRelations(n.node, ctx)
      })
      return addedNodes
    },

    generateSchema() {
      schemaRef.value = JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': client.graphNodes,
      }, undefined, 2)
    },

    findNode<T extends SchemaNode>(id: Id) {
      const key = resolveRawId(id)
      return client.graphNodes.find(n => resolveRawId(n['@id']) === key) as unknown as T | null
    },

    addNode(node, ctx) {
      const key = resolveRawId(node['@id'])
      idGraph[ctx.uid] = defu({
        [key]: node,
      }, idGraph[ctx.uid] || {})
      return key
    },

    removeNode(node, ctx) {
      const key = (typeof node === 'string' ? node : resolveRawId(node['@id'])) as Id
      delete idGraph[ctx.uid][key]
    },

    removeContext(ctx) {
      delete idGraph[ctx.uid]
    },

    get graphNodes() {
      // create the nodes
      const nodes: Record<Id, SchemaNode> = {}
      // iterating up through the object keys, we add them by id in ascending order
      Object.keys(idGraph)
        .sort((a, b) => parseInt(a) - parseInt(b))
        .forEach((key) => {
          Object
            .values(idGraph[parseInt(key)])
            .map(n => unref(n))
            .forEach((n) => {
              nodes[resolveRawId(n['@id'])] = n
            })
        })
      // flatten them
      return Object.values(nodes)
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

      // we only need to init the DOM once since we have a reactive head object and a watcher to update the DOM
      if (_domSetup)
        return

      head.addHeadObjs(computed(() => {
        return {
          // Can be static or computed
          script: [
            {
              type: 'application/ld+json',
              key: 'root-schema-org-graph',
              children: schemaRef.value,
            },
          ],
        }
      }))
      watchEffect(() => {
        if (head && typeof window !== 'undefined')
          head.updateDOM()
      })
      _domSetup = true
    },
  }
  return client
}
