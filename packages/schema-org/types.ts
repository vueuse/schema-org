import type { Optional } from 'utility-types'

export type OptionalStrictMeta<T extends Thing, Keys extends keyof T> = Optional<T, Keys>
export type OptionalMeta<T extends Thing, Keys extends keyof T = ('@id'|'@type')> = Optional<T, Keys>
export type Arrayable<T> = T | Array<T>
export type WithAmbigiousFields<T> = T & Record<string, unknown>

export type IdGraph = Record<Id, SchemaOrgNode>

export interface Thing {
  '@type': string|string[]
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
   * @todo
   */
  potentialAction?: unknown
}

export type SchemaOrgNode = Thing

export interface IdReference {
  /** IRI identifying the canonical address of this object. */
  '@id': string
}

export type Id = `#${string}`|`https://${string}/#${string}`
