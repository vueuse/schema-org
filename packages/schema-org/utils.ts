import { hasProtocol, joinURL, withBase } from 'ufo'
import { defu } from 'defu'
import type { DeepPartial } from 'utility-types'
import type { Arrayable, Id, IdReference, OptionalMeta, SchemaOrgNode } from './types'
import type { SchemaOrgClient } from './createSchemaOrg'
import { useSchemaOrg } from './useSchemaOrg'
import type { ImageObject } from './defineImage'

export const idReference = (node: SchemaOrgNode|string) => ({
  '@id': typeof node !== 'string' ? node['@id'] : node,
})

export const resolveDateToIso = <T extends SchemaOrgNode>(node: T, field: keyof T) => {
  if (node[field] instanceof Date) {
    // @ts-expect-error untyped
    node[field] = (node[field] as Date).toISOString()
  }
  else if (typeof node[field] === 'string') {
    // @ts-expect-error untyped
    node[field] = new Date(Date.parse(node[field] as unknown as string)).toISOString()
  }
}

export const IdentityId = '#identity'

export const setIfEmpty = <T extends SchemaOrgNode>(node: T, field: keyof T, value: any) => {
  if (!node?.[field])
    node[field] = value
}

export const includesType = <T extends SchemaOrgNode>(node: T, type: string) => {
  const types = Array.isArray(node['@type']) ? node['@type'] : [node['@type']]
  return types.includes(type)
}

export const prefixId = (url: string, id: Id) => {
  // already prefixed
  if (hasProtocol(id))
    return url as Id
  if (!id.startsWith('#'))
    id = `#${id}`
  return joinURL(url, id) as Id
}

export const ensureBase = (host: string, url: string) => {
  // can't apply base if there's a protocol
  if (hasProtocol(url) || !url.startsWith('/'))
    return url
  return withBase(url, host)
}

export const ensureUrlBase = (host: string, thing: ImageObject|string) => {
  if (typeof thing == 'string')
    return ensureBase(host, thing)
  return {
    ...thing,
    url: ensureBase(host, thing.url),
  }
}

export const resolveImageUrls = (host: string, image?: Arrayable<ImageObject|IdReference|string>) => {
  const isArray = Array.isArray(image)
  const images = isArray ? image : [image]
  for (const i in images) {
    const img = images[i]
    // @ts-expect-error IdReference not typed
    if (img && (typeof img === 'string' || typeof img.url !== 'undefined'))
      images[i] = !images[i] ? images[i] : ensureUrlBase(host, img as string|ImageObject)
  }

  return (isArray ? images : images[0]) as Arrayable<ImageObject|IdReference|string>
}

/**
 * Removes attributes which have a null or undefined value
 */
export const cleanAttributes = (obj: any) => {
  Object.keys(obj).forEach((k) => {
    if (obj[k] && typeof obj[k] === 'object') {
      cleanAttributes(obj[k])
      return
    }
    if (obj[k] === '' || obj[k] === null || typeof obj[k] === 'undefined')
      delete obj[k]
  })
  return obj
}

export interface DefineSchemaOrgNode<T> {
  defaults?: DeepPartial<T>|((client: SchemaOrgClient) => DeepPartial<T>)
  resolve?: (node: T, client: SchemaOrgClient) => T
  mergeRelations?: (node: T, client: SchemaOrgClient) => void
}

type AppendFn<T> = (client: SchemaOrgClient) => DeepPartial<T>

export interface NodeResolver<T extends SchemaOrgNode, K extends keyof T =('@id'|'@type')> {
  resolve: () => T
  nodePartial: OptionalMeta<T, K>
  append: AppendFn<T>[]
  resolveId: () => T['@id']
  definition: DefineSchemaOrgNode<T>
}

export function defineNodeResolver<T extends SchemaOrgNode, K extends keyof T =('@id'|'@type')>(
  nodePartial: OptionalMeta<T, K>,
  definition: DefineSchemaOrgNode<T>,
): NodeResolver<T, K> {
  const append: AppendFn<T>[] = []

  // avoid duplicate resolves
  let _resolved: T|null = null

  const nodeResolver = {
    nodePartial,
    definition,
    append,
    resolve() {
      if (_resolved)
        return _resolved
      const client = useSchemaOrg()
      // resolve defaults
      let defaults = definition?.defaults || {}
      if (typeof defaults === 'function')
        defaults = defaults(client)
      // defu user input with defaults
      let node = defu(nodePartial, defaults) as unknown as T
      // run appends
      append.forEach((appendNode) => {
        node = defu(appendNode(client), node) as T
      })
      // strip out null or undefined values
      node = cleanAttributes(node)
      // allow the node to resolve itself
      if (definition.resolve)
        node = definition.resolve(node, client)
      return _resolved = node
    },
    resolveId() {
      return nodeResolver.resolve()['@id']
    },
  }
  return nodeResolver
}
