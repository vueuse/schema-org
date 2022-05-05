import type { Optional } from 'utility-types'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import type { ComponentInternalInstance, Ref } from 'vue-demi'
import type { HeadClient } from '@vueuse/head'
import type { App } from 'vue'
import type { ConsolaLogObject } from 'consola'
import type { UseSchemaOrgInput } from './useSchemaOrg'
import type { ImageInput } from './nodes/Image'

export type Arrayable<T> = T | Array<T>

export type MaybeRef<T> = {
  [P in keyof T]: T[P] | Ref<T[P]>;
}

export type SchemaNodeInput<T extends SchemaNode, OptionalKeys extends keyof T = DefaultOptionalKeys> = Optional<T, OptionalKeys>

export type IdGraph = Record<number, Record<Id, SchemaNode>>

export type ResolvableDate = string | Date

export type DefaultOptionalKeys = '@id' | '@type'

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
export type ConsolaFn = (message: ConsolaLogObject | any, ...args: any[]) => void
