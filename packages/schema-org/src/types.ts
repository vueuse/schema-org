import type { MetaInput } from 'schema-org-graph-js'

export interface BaseMetaInput {
  host: string
  url?: string
  path?: string
  currency?: string
  image?: string
  inLanguage?: string
  title?: string
  description?: string
  datePublished?: string
  dateModified?: string
  /**
   * @deprecated use `language`
   */
  defaultLanguage?: string
  /**
   * @deprecated use `currency`
   */
  defaultCurrency?: string
  /**
   * @deprecated use `host`
   */
  canonicalHost?: string
  /**
   * @deprecated use `url` or `path`
   */
  canonicalUrl?: string
}

export interface ResolvedUserConfig {
  /**
   * Should schema.org only be rendered by the server.
   *
   * Useful for optimising performance as it may not be needed by search engines. Changes runtime package size to 0kb.
   *
   * @default false
   */
  client?: boolean
  /**
   * Should full schema types from `schema-dts` be used over a simplified version.
   *
   * @default false
   */
  full?: boolean
  /**
   * Extra default metadata for the schema.org generation, you can use this as an alternative to the other meta.
   */
  meta: MetaInput
}

export interface UserConfig {
  /**
   * Should schema.org only be rendered by the server.
   *
   * Useful for optimising performance as it may not be needed by search engines. Changes runtime package size to 0kb.
   *
   * @default false
   */
  client?: boolean
  /**
   * Should full schema types from `schema-dts` be used over a simplified version.
   *
   * @default false
   */
  full?: boolean
  /**
   * Extra default metadata for the schema.org generation, you can use this as an alternative to the other meta.
   */
  meta?: BaseMetaInput
  /**
   * The production URL of your site. This allows the client to generate all URLs for you and is important to set correctly.
   */
  canonicalHost?: `https://${string}`
  /**
   * Will set the `isLanguage` to this value for any Schema which uses it. Should be a valid language code, i.e `en-AU`
   */
  defaultLanguage?: string
  /**
   * Will set the `priceCurrency` for [Product](/schema/product) Offer Schema. Should be a valid currency code, i.e `AUD`
   */
  defaultCurrency?: string
  /**
   * @deprecated You can remove this option, it doesn't do anything now.
   */
  debug?: boolean
}
