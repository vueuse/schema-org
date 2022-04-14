import type { Optional } from 'utility-types'

export type OptionalMeta<T extends Thing, Keys extends keyof T = ('@id'|'@type')> = Optional<T, Keys>
export type Arrayable<T> = T | Array<T>

export type IdGraph = Record<Id, SchemaOrgNode>

export interface Thing {
  '@type': string|string[]
  '@id': string

  // allow any field
  [key: string]: unknown
  // custom meta that will be stripped out
  _mergeStrategy?: (graph: Record<string, Thing>) => void
}

export type SchemaOrgNode = Thing

export interface IdReference {
  /** IRI identifying the canonical address of this object. */
  '@id': string
}

export type Id = `#${string}`
