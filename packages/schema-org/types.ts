import type { Optional } from 'utility-types'

export type OptionalMeta<T extends Thing, Keys extends keyof T = '@id'> = Optional<T, '@id' | '@type' | Keys>

export interface Thing {
  '@type': string|string[]
  '@id': string
}

export type SchemaOrgNode = Thing

export interface IdReference {
  /** IRI identifying the canonical address of this object. */
  '@id': string
}
