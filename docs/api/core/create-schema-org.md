# createSchemaOrg

- **Type:** `(options: CreateSchemaOrgInput) => SchemaOrgClient`

  Create the Schema.org manager instance.

  Sets up a placeholder within `@vueuse/head` for Schema.org to be reactively inserted.

  ```ts
  import { createSchemaOrg, useVueUseHead } from '@vueuse/schema-org'

  const schemaOrg = createSchemaOrg({
    ...options,
    provider: {
      setupDOM: useVueUseHead(head),
      provider: 'vitesse',
      useRoute: () => ctx.router.currentRoute.value,
    },
  })
  ```
  **CreateSchemaOrgInput**

  ```ts
  export interface ProviderOption {
    provider: {
      /**
       * Client used to write schema to the document.
       */
      setupDOM: (client: SchemaOrgClient) => void
      /**
       * A function used to resolve a reactive route.
       */
      useRoute: () => RouteLocationNormalizedLoaded
      /**
       * An ID for the integration, used for handling edge cases in specific frameworks.
       */
      name?: 'vitepress' | 'nuxt' | 'vitesse' | string
    }
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
  ```

  **SchemaOrgClient**

  ```ts
  export interface SchemaOrgClient {
    install: (app: App) => void
    graphNodes: SchemaNode[]
    schemaRef: Ref<string>
  
    /**
     * Adds a node to the graph with the given Vue component context.
     */
    addNode: <T extends SchemaNode>(node: T, ctx: InstanceContext) => Id
    /**
     * Given a Vue component context, deleted any nodes associated with it.
     */
    removeContext: (ctx: InstanceContext) => void
    /**
     * Sets up the initial placeholder for the meta tag using useHead.
     */
    setupDOM: () => void
    /**
     * Given an Id (#identity) find the associated node. Used for resolving relations.
     */
    findNode: <T extends SchemaNode>(id: Id) => T | null
  
    /**
     * Main API to add nodes, handles resolving and relations.
     */
    addNodesAndResolveRelations(ctx: InstanceContext, nodes: Arrayable<UseSchemaOrgInput>): Set<Id>
  
    /**
     * Trigger the schemaRef to be updated.
     */
    generateSchema: () => void
    debug: ConsolaFn | ((...arg: any) => void)
  
    setupRouteContext: (vm: ComponentInternalInstance) => InstanceContext
    options: CreateSchemaOrgInput
  }
  ```
