import { hasProtocol, joinURL, withBase } from 'ufo'
import { defu } from 'defu'
import type { DeepPartial } from 'utility-types'
import type { Arrayable, Id, IdReference, SchemaNode, SchemaNodeInput } from './types'
import type { SchemaOrgClient } from './createSchemaOrg'
import { useSchemaOrg } from './useSchemaOrg'
import { resolveImages } from './shared/resolveImages'

export const idReference = (node: SchemaNode|string) => ({
  '@id': typeof node !== 'string' ? node['@id'] : node,
})

export const resolveDateToIso = <T extends SchemaNode>(node: T, field: keyof T) => {
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

export const setIfEmpty = <T extends SchemaNode|SchemaNodeInput<SchemaNode>>(node: T, field: keyof T, value: any) => {
  if (!node?.[field])
    node[field] = value
}

export const isIdReference = (input: IdReference|SchemaNodeInput<any>) => Object.keys(input).length === 1 && input['@id']

export function resolver<T extends SchemaNodeInput<SchemaNode>>(input: Arrayable<T>, fn: (node: T, client: SchemaOrgClient) => any) {
  const client = useSchemaOrg()
  const ids = (Array.isArray(input) ? input : [input]).map((a) => {
    // filter out id references
    if (isIdReference(a))
      return a
    return fn(a, client)
  })
  // avoid arrays for single entries
  if (ids.length === 1)
    return ids[0]
  return ids
}

export const includesType = <T extends SchemaNode>(node: T, type: string) => {
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

export const resolveType = (node: SchemaNode, defaultType: Arrayable<string>) => {
  if (typeof node['@type'] === 'string' && node['@type'] !== defaultType) {
    node['@type'] = [
      ...(Array.isArray(defaultType) ? defaultType : [defaultType]),
      node['@type'],
    ]
  }
}

export const ensureBase = (base: string, urlOrPath: string) => {
  // can't apply base if there's a protocol
  if (!urlOrPath || hasProtocol(urlOrPath) || (!urlOrPath.startsWith('/') && !urlOrPath.startsWith('#')))
    return urlOrPath
  return withBase(urlOrPath, base)
}

export const resolveId = (node: SchemaNode, prefix: string) => {
  if (node['@id'])
    node['@id'] = ensureBase(prefix, node['@id']) as Id
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

export const resolveRouteMeta = <T extends SchemaNodeInput<any> = SchemaNodeInput<any>>(defaults: T, routeMeta: Record<string, unknown>, keys: (keyof T)[]) => {
  if (typeof routeMeta.title === 'string') {
    if (keys.includes('headline'))
      setIfEmpty(defaults, 'headline', routeMeta.title)

    if (keys.includes('name'))
      setIfEmpty(defaults, 'name', routeMeta.title)
  }
  if (typeof routeMeta.description === 'string' && keys.includes('description'))
    setIfEmpty(defaults, 'description', routeMeta.description)

  if (typeof routeMeta.image === 'string' && keys.includes('image'))
    setIfEmpty(defaults, 'image', routeMeta.image)

  if (keys.includes('dateModified') && (typeof routeMeta.dateModified === 'string' || routeMeta.dateModified instanceof Date))
    setIfEmpty(defaults, 'dateModified', routeMeta.dateModified)

  if (keys.includes('datePublished') && (typeof routeMeta.datePublished === 'string' || routeMeta.datePublished instanceof Date))
    setIfEmpty(defaults, 'datePublished', routeMeta.datePublished)
  // video
  if (keys.includes('uploadDate') && (typeof routeMeta.datePublished === 'string' || routeMeta.datePublished instanceof Date))
    setIfEmpty(defaults, 'uploadDate', routeMeta.datePublished)
}

export interface DefineSchemaNode<T> {
  defaults?: DeepPartial<T>|((client: SchemaOrgClient) => DeepPartial<T>)
  resolve?: (node: T, client: SchemaOrgClient) => T
  mergeRelations?: (node: T, client: SchemaOrgClient) => void
}

export interface NodeResolver<T extends SchemaNode, K extends keyof T =('@id'|'@type')> {
  resolve: () => T
  nodePartial: SchemaNodeInput<T, K>
  resolveId: () => T['@id']
  definition: DefineSchemaNode<T>
}

export function defineNodeResolver<T extends SchemaNode, K extends keyof T =('@id'|'@type')>(
  nodePartial: SchemaNodeInput<T, K>,
  definition: DefineSchemaNode<T>,
): NodeResolver<T, K> {
  // avoid duplicate resolves
  let _resolved: T|null = null
  const nodeResolver = {
    nodePartial,
    definition,
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
      resolveImages(node, 'image')
      // allow the node to resolve itself
      if (definition.resolve)
        node = definition.resolve(node, client)
      return _resolved = cleanAttributes(node)
    },
    resolveId() {
      return nodeResolver.resolve()['@id']
    },
  }
  return nodeResolver
}
