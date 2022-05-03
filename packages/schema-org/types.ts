import type { Optional } from 'utility-types'
import 'vue-router'
import type { Ref } from 'vue-demi'
import type { ImageInput } from './shared/resolveImages'

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
