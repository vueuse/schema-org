import type { RouteLocationNormalizedLoaded } from 'vue-router'
import type { ConsolaLogObject } from 'consola'
import type { SchemaOrgClient } from './createSchemaOrg'

export type Arrayable<T> = T | Array<T>

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    description?: string
    dateModified?: string | Date
    datePublished?: string | Date
    image?: string
  }
}

export interface SchemaOrgContext {
  canonicalHost: string
  canonicalUrl: string
  uid: number
  meta: Record<string, any>
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
