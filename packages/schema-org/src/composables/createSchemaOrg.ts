import type { App, ComputedRef, Ref } from 'vue'
import { computed, ref } from 'vue'
import type {
  MetaInput,
  SchemaOrgContext,
} from 'schema-org-graph-js'
import {
  buildResolvedGraphCtx,
  createSchemaOrgGraph, organiseNodes, renderNodesToSchemaOrgHtml, resolveMeta,
} from 'schema-org-graph-js'
// @ts-expect-error untyped
import { deepUnref } from 'vue-deepunref'

export interface CreateSchemaOrgInput {
  /**
   * The meta data used to render the final schema.org graph.
   */
  meta: () => MetaInput | Promise<MetaInput>
  /**
   * Client used to write schema to the document.
   */
  updateHead: (fn: ComputedRef) => void | Promise<void>
}

export interface SchemaOrgVuePlugin {
  /**
   * Install the plugin on the Vue context.
   *
   * @param app
   */
  install: (app: App) => void
  /**
   * Given a Vue component context, deleted any nodes associated with it.
   */
  removeContext: (uid: number) => void
  /**
   * Sets up the initial placeholder for the meta tag using useHead.
   */
  setupDOM: () => void | Promise<void>
  /**
   * Trigger the schemaRef to be updated.
   */
  generateSchema: () => Promise<Ref<string>> | Ref<string>
  /**
   * Force Schema.org to be refreshed in the DOM.
   */
  forceRefresh: () => Promise<void>
  /**
   * The inner context being used to generate the Schema.org graph.
   */
  ctx: SchemaOrgContext
  /**
   * Options used to render the Schema.
   */
  options: CreateSchemaOrgInput
}

export const createSchemaOrg = (options: CreateSchemaOrgInput) => {
  const schemaRef = ref<string>('')

  let ctx = createSchemaOrgGraph()

  const resolveGraphNodesToHtml = async () => {
    const meta = await options.meta()
    const resolvedMeta = resolveMeta(deepUnref(meta))
    const resolvedCtx = buildResolvedGraphCtx(ctx.nodes.map(deepUnref), resolvedMeta)
    const nodes = organiseNodes(resolvedCtx.nodes)
    return renderNodesToSchemaOrgHtml(nodes)
  }

  const client: SchemaOrgVuePlugin = {
    ctx,
    options,

    install(app) {
      app.config.globalProperties.$schemaOrg = client
      app.provide('schemaorg', client)
    },

    async generateSchema() {
      schemaRef.value = await resolveGraphNodesToHtml()
      return schemaRef
    },

    async forceRefresh() {
      await client.generateSchema()
      await client.setupDOM()
    },

    removeContext(uid) {
      const newCtx = createSchemaOrgGraph()
      newCtx.meta = ctx.meta
      newCtx.addNode(ctx.nodes.filter(n => n._uid !== uid))
      ctx = newCtx
    },

    setupDOM() {
      return options.updateHead(computed(() => {
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
    },
  }
  return client
}
