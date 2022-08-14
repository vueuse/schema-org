import type { App, InjectionKey, Ref } from 'vue-demi'
import { joinURL, withProtocol, withTrailingSlash } from 'ufo'
import { defu } from 'defu'
import { computed, ref, unref } from 'vue-demi'
import type {
  SchemaOrgContext,
} from 'schema-org-graph-js'
import {
  buildResolvedGraphCtx,
  createSchemaOrgGraph, dedupeAndFlattenNodes, renderNodesToSchemaOrgHtml,
} from 'schema-org-graph-js'
import type {
  ConsolaFn,
  CreateSchemaOrgInput,
} from '../../types'

export interface SchemaOrgClient {
  install: (app: App) => void

  /**
   * Given a Vue component context, deleted any nodes associated with it.
   */
  removeContext: (uid: Number) => void
  /**
   * Sets up the initial placeholder for the meta tag using useHead.
   */
  setupDOM: () => void

  /**
   * Trigger the schemaRef to be updated.
   */
  generateSchema: () => Ref<string>
  resolveGraph: () => SchemaOrgContext
  resolvedSchemaOrg: () => string

  debug: ConsolaFn | ((...arg: any) => void)

  schemaRef: Ref<string>
  ctx: SchemaOrgContext
  options: CreateSchemaOrgInput
}

const unrefDeep = (n: any) => {
  for (const key in n)
    n[key] = unref(n[key])
  return n
}

export const PROVIDE_KEY = Symbol('schemaorg') as InjectionKey<SchemaOrgClient>

export const createSchemaOrg = (options: CreateSchemaOrgInput) => {
  options = defu(options, {
    debug: false,
    defaultLanguage: 'en',
  })

  const schemaRef = ref<string>('')

  let ctx = createSchemaOrgGraph()

  // eslint-disable-next-line no-console
  const debug: ConsolaFn | ((...arg: any) => void) = (...arg: any) => { options.debug && console.debug(...arg) }
  const warn: ConsolaFn | ((...arg: any) => void) = (...arg: any) => { console.warn(...arg) }

  const client: SchemaOrgClient = {
    install(app) {
      app.config.globalProperties.$schemaOrg = client
      app.provide(PROVIDE_KEY, client)
    },

    ctx,
    debug,
    options,
    schemaRef,

    resolveGraph() {
      const meta = unrefDeep(options.meta())

      if (meta.host && !meta.canonicalHost)
        meta.canonicalHost = meta.host

      if (!meta.canonicalHost) {
        warn('Missing required `canonicalHost` from `createSchemaOrg`.')
      }
      else {
        // all urls should be fully qualified, such as https://example.com/
        meta.canonicalHost = withTrailingSlash(withProtocol(meta.canonicalHost, 'https://'))
      }
      if (meta.path && !meta.canonicalUrl)
        meta.canonicalUrl = joinURL(meta.canonicalHost, meta.path)

      return buildResolvedGraphCtx(ctx.nodes.map(unrefDeep), meta)
    },

    resolvedSchemaOrg() {
      const resolvedCtx = client.resolveGraph()
      const nodes = dedupeAndFlattenNodes(resolvedCtx.nodes)
      return renderNodesToSchemaOrgHtml(nodes)
    },

    generateSchema() {
      schemaRef.value = client.resolvedSchemaOrg()
      return schemaRef
    },

    removeContext(uid) {
      const newCtx = createSchemaOrgGraph()
      newCtx.meta = ctx.meta
      newCtx.addNode(ctx.nodes.filter(n => n._uid !== uid))
      ctx = newCtx
    },

    setupDOM() {
      if (options?.updateHead) {
        options.updateHead(computed(() => {
          return {
            // Can be static or computed
            script: [
              {
                'type': 'application/ld+json',
                'data-id': 'schema-org-graph',
                'key': 'schema-org-graph',
                'children': schemaRef.value,
                'body': true,
              },
            ],
          }
        }))
      }
    },
  }
  return client
}
