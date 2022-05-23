import type { DeepPartial, Optional } from 'utility-types'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import type { App, ComponentInternalInstance, Ref } from 'vue'
import type { ConsolaLogObject } from 'consola'
import type { ImageInput } from './nodes/Image'

export type Arrayable<T> = T | Array<T>

export type MaybeRef<T> = {
  [P in keyof T]: T[P] | Ref<T[P]>;
}

export type SchemaNodeInput<T extends SchemaNode, OptionalKeys extends keyof T = DefaultOptionalKeys> = Optional<T, OptionalKeys>

export type IdGraph = Record<number, Record<Id, SchemaNode>>

export type ResolvableDate = string | Date

export type DefaultOptionalKeys = '@id' | '@type'

export interface NodeResolverInput<Input, ResolvedInput> {
  defaults?: DeepPartial<ResolvedInput> | ((ctx: SchemaOrgContext) => DeepPartial<ResolvedInput>)
  required?: (keyof ResolvedInput)[]
  resolve?: (node: Input | ResolvedInput, ctx: SchemaOrgContext) => Input | ResolvedInput
  rootNodeResolve?: (node: ResolvedInput, ctx: SchemaOrgContext) => void
}

export interface ResolvedRootNodeResolver<Input, ResolvedInput = Input> {
  resolve: (ctx: SchemaOrgContext) => ResolvedInput
  resolveAsRootNode: (ctx: SchemaOrgContext) => void
}

export type UseSchemaOrgInput = ResolvedRootNodeResolver<any> | Thing | Record<string, any>

export interface Thing {
  '@type': Arrayable<string>
  '@id': Id
  /**
   * A reference-by-ID to the WebPage node.
   */
  mainEntityOfPage?: Arrayable<IdReference>
  /**
   * A reference-by-ID to the WebPage node.
   */
  mainEntity?: Arrayable<IdReference>
  /**
   * An image object or referenced by ID.
   * - Must be at least 696 pixels wide.
   * - Must be of the following formats+file extensions: .jpg, .png, .gif ,or .webp.
   */
  image?: Arrayable<ImageInput>
}

export type SchemaNode = Thing

export interface IdReference {
  /** IRI identifying the canonical address of this object. */
  '@id': string
}

export type MaybeIdReference<T> = T | IdReference

export type Id = `#${string}` | `https://${string}#${string}`

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    description?: string
    dateModified?: string | Date
    datePublished?: string | Date
    image?: string
  }
}
export interface SchemaOrgClient {
  install: (app: App) => void
  graphNodes: SchemaNode[]
  schemaRef: Ref<string>

  /**
   * Adds a node to the graph with the given Vue component context.
   */
  addNode: <T extends SchemaNode>(node: T, ctx: SchemaOrgContext) => Id
  /**
   * Given an Id (#identity) find the associated node. Used for resolving relations.
   */
  findNode: <T extends SchemaNode>(id: Id) => T | null
  /**
   * Given a Vue component context, deleted any nodes associated with it.
   */
  removeContext: (ctx: SchemaOrgContext) => void
  /**
   * Sets up the initial placeholder for the meta tag using useHead.
   */
  setupDOM: () => void

  /**
   * Main API to add nodes, handles resolving and relations.
   */
  addNodesAndResolveRelations(ctx: SchemaOrgContext, nodes: Arrayable<UseSchemaOrgInput>): Set<Id>

  /**
   * Trigger the schemaRef to be updated.
   */
  generateSchema: () => void
  debug: ConsolaFn | ((...arg: any) => void)

  setupRouteContext: (vm: ComponentInternalInstance) => SchemaOrgContext
  options: CreateSchemaOrgInput
}

export interface SchemaOrgContext {
  canonicalHost: string
  canonicalUrl: string
  uid: number
  meta: Record<string, any>
  // client helpers
  addNode: <T extends SchemaNode>(node: T, ctx: SchemaOrgContext) => Id
  findNode: <T extends SchemaNode>(id: Id) => T | null
  options: CreateSchemaOrgInput
}

export type CreateSchemaOrgInput = SchemaOrgOptions & FrameworkAugmentationOptions

export interface FrameworkAugmentationOptions {
  /**
   * The useHead client used to insert the meta tag.
   */
  head?: HeadClient | any
  /**
   * A function used to resolve a reactive route.
   */
  useRoute: () => RouteLocationNormalizedLoaded
  /**
   * An ID for the integration, used for handling edge cases in specific frameworks.
   */
  provider?: 'vitepress' | 'nuxt' | 'vitesse' | string
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

export type ConsolaFn = (message: ConsolaLogObject | any, ...args: any[]) => void
