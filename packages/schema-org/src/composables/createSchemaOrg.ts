import type { App, ComputedRef, InjectionKey, Ref } from 'vue'
import { computed, ref, unref } from 'vue'
import type {
  MetaInput,
  SchemaOrgContext,
} from 'schema-org-graph-js'
import {
  buildResolvedGraphCtx,
  createSchemaOrgGraph, dedupeAndFlattenNodes, renderNodesToSchemaOrgHtml, resolveMeta,
} from 'schema-org-graph-js'

export interface CreateSchemaOrgInput {
  /**
   * The meta data used to render the final schema.org graph.
   */
  meta: () => MetaInput
  /**
   * Client used to write schema to the document.
   */
  updateHead: (fn: ComputedRef) => void
  /**
   * Will enable debug logs to be shown.
   */
  debug?: boolean
}

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
  const schemaRef = ref<string>('')

  let ctx = createSchemaOrgGraph()

  const client: SchemaOrgClient = {
    install(app) {
      app.config.globalProperties.$schemaOrg = client
      app.provide(PROVIDE_KEY, client)
    },

    ctx,
    options,
    schemaRef,

    resolveGraph() {
      const meta = resolveMeta(unrefDeep(options.meta()))
      if (!meta.host)
        console.warn('[WARN] `@vueuse/schema-org`: Missing required `host` from `createSchemaOrg`.')
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
