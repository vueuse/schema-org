import type { ConsolaLogObject } from 'consola'
import type { ComputedRef } from 'vue-demi'

export type Arrayable<T> = T | Array<T>

export interface SchemaOrgContext {
  canonicalHost: string
  canonicalUrl: string
  uid: number
  meta: Record<string, any>
  options: CreateSchemaOrgInput
}

export type CreateSchemaOrgInput = ProviderOptions

export interface ProviderOptions {
  meta: () => Record<string, any>
  /**
   * Client used to write schema to the document.
   */
  updateHead: (fn: ComputedRef) => void
  /**
   * Will enable debug logs to be shown.
   */
  debug?: boolean
}

export type ConsolaFn = (message: ConsolaLogObject | any, ...args: any[]) => void
