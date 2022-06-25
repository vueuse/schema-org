import type { DeepPartial, Optional } from 'utility-types'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import type { App, Ref } from 'vue'
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
   * An additional type for the item,
   * typically used for adding more specific types from external vocabularies in microdata syntax.
   * This is a relationship between something and a class that the thing is in.
   * In RDFa syntax, it is better to use the native RDFa syntax - the 'typeof' attribute - for multiple types.
   * Schema.org tools may have only weaker understanding of extra types, in particular those defined externally.
   */
  additionalType?: string
  /**
   * An alias for the item.
   */
  additionalName?: string
  /**
   * A description of the item.
   */
  description?: string
  /**
   * A sub property of description.
   * A short description of the item used to disambiguate from other, similar items.
   * Information from other properties (in particular, name)
   * may be necessary for the description to be useful for disambiguation.
   */
  disambiguatingDescription?: string
  /**
   * The identifier property represents any kind of identifier
   * for any kind of Thing, such as ISBNs, GTIN codes, UUIDs etc.
   * Schema.org provides dedicated properties for representing many of these,
   * either as textual strings or as URL (URI) links.
   */
  identifier?: PropertyValue | string
  /**
   * The name of the item.
   */
  name?: string
  /**
   * Indicates a potential Action, which describes an idealized action in which this thing would play an 'object' role.
   */
  potentialAction?: Action
  /**
   * URL of a reference Web page that unambiguously indicates the item's identity.
   * E.g. the URL of the item's Wikipedia page, Wikidata entry, or official website.
   */
  sameAs?: string
  /**
   * A CreativeWork or Event about this Thing
   */
  subjectOf?: Arrayable<IdReference>
  /**
   * URL of the item.
   */
  url?: string
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
export type Intangible = Thing
export type StructuredValue = Thing
export type Action = Thing

export interface PropertyValue extends Intangible {
  /**
   * The upper value of some characteristic or property.
   */
  maxValue?: number
  /**
   * The lower value of some characteristic or property.
   */
  minValue?: number
  /**
   * A commonly used identifier for the characteristic represented by the property,
   * e.g. a manufacturer or a standard code for a property. propertyID can be
   * (1) a prefixed string, mainly meant to be used with standards for product properties;
   * (2) a site-specific, non-prefixed string
   *   (e.g. the primary key of the property or the vendor-specific id of the property), or
   * (3) a URL indicating the type of the property, either pointing to an external vocabulary,
   * or a Web resource that describes the property (e.g. a glossary entry).
   * Standards bodies should promote a standard prefix for the identifiers of properties from their standards.
   */
  propertyID?: string
  /**
   * The unit of measurement given using the UN/CEFACT Common Code (3 characters) or a URL.
   * Other codes than the UN/CEFACT Common Code may be used with a prefix followed by a colon.
   */
  unitCode?: string
  /**
   * A string or text indicating the unit of measurement.
   * Useful if you cannot provide a standard unit code for unitCode.
   */
  unitText?: string
  /**
   * The value of the quantitative value or property value node.
   */
  value?: boolean | number | string | StructuredValue
  /**
   * A secondary value that provides additional information on the original value,
   * e.g. a reference temperature or a type of measurement.
   */
  valueReference?: PropertyValue | StructuredValue | string
}

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

  setupRouteContext: (uid: number) => SchemaOrgContext
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

export type CreateSchemaOrgInput = SchemaOrgOptions & ProviderOption

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

export type ConsolaFn = (message: ConsolaLogObject | any, ...args: any[]) => void
