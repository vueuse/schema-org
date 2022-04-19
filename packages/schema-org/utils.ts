import { hasProtocol, joinURL } from 'ufo'
import { defu } from 'defu'
import type { Id, OptionalMeta, SchemaOrgNode } from './types'
import type { SchemaOrgClient } from './createSchemaOrg'
import { useSchemaOrg } from './useSchemaOrg'

export const idReference = (node: SchemaOrgNode|string) => ({
  '@id': typeof node !== 'string' ? node['@id'] : node,
})

export const resolveDateToIso = <T extends SchemaOrgNode>(node: T, field: keyof T) => {
  if (node[field] instanceof Date) {
    // @ts-expect-error untyped
    node[field] = (node[field] as Date).toISOString()
  }
}

export const IdentityId = '#identity'

export const setIfEmpty = <T extends SchemaOrgNode>(node: T, field: keyof T, value: any) => {
  if (!node?.[field])
    node[field] = value
}

export const prefixId = (url: string, id: Id) => {
  // already prefixed
  if (hasProtocol(id))
    return url as Id
  if (!id.startsWith('#'))
    id = `#${id}`
  return joinURL(url, id) as Id
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
  defaults?: Partial<T>|((client: SchemaOrgClient) => Partial<T>)
  resolve?: (node: T, client: SchemaOrgClient) => T
  mergeRelations?: (node: T, client: SchemaOrgClient) => void
}

export interface NodeResolver<T extends SchemaOrgNode, K extends keyof T =('@id'|'@type')> {
  resolve: () => T
  nodePartial: OptionalMeta<T, K>
  definition: DefineSchemaOrgNode<T>
}

export function defineNodeResolverSchema<T extends SchemaOrgNode, K extends keyof T =('@id'|'@type')>(
  nodePartial: OptionalMeta<T, K>,
  definition: DefineSchemaOrgNode<T>,
): NodeResolver<T, K> {
  return {
    nodePartial,
    definition,
    resolve() {
      const client = useSchemaOrg()
      // resolve defaults
      let defaults = definition?.defaults || {}
      if (typeof defaults === 'function')
        defaults = defaults(client)
      // merge user input with defaults, strip out null or undefined values
      let node = cleanAttributes(defu(nodePartial, defaults)) as T
      // allow the node to resolve itself
      if (definition.resolve)
        node = definition.resolve(node, client)
      return node
    },
  }
}
