import { hasProtocol, joinURL, withBase } from 'ufo'
import { defu } from 'defu'
import { isRef, unref } from 'vue-demi'
import type { DeepPartial } from 'utility-types'
import type { Arrayable, Id, IdReference, MaybeRef, SchemaNode, SchemaNodeInput } from '../types'
import { resolveImages } from '../shared/resolveImages'
import type { SchemaOrgContext } from '../createSchemaOrg'

export const idReference = (node: SchemaNode | string) => ({
  '@id': typeof node !== 'string' ? node['@id'] : node,
})

export const resolveDateToIso = (val: Date | string) => {
  try {
    if (val instanceof Date)
      return val.toISOString()
    else
      return new Date(Date.parse(val)).toISOString()
  }
  // not too fussed if it can't be resolved, this is on the user to validate
  catch (e) {}
  return typeof val === 'string' ? val : val.toString()
}

export const IdentityId = '#identity'

export const setIfEmpty = <T extends SchemaNode | SchemaNodeInput<SchemaNode>>(node: T, field: keyof T, value: any) => {
  if (!node?.[field])
    node[field] = value
}

export const dedupeMerge = <T extends SchemaNode | SchemaNodeInput<SchemaNode>>(node: T, field: keyof T, value: any) => {
  const dedupeMerge: any[] = []
  if (Array.isArray(node[field]))
    // @ts-expect-error untyped key
    dedupeMerge.push(...node[field])
  else if (node[field])
    dedupeMerge.push(node[field])
  const data = new Set(dedupeMerge)
  data.add(value)
  // @ts-expect-error untyped key
  node[field] = [...data.values()]
}

type ResolverInput<T extends SchemaNode = SchemaNode> = SchemaNodeInput<T> | IdReference | string

export const isIdReference = (input: ResolverInput) =>
  typeof input !== 'string' && Object.keys(input).length === 1 && input['@id']

export interface ResolverOptions {
  /**
   * Return single images as an object
   */
  array?: boolean
}

export function resolveArrayable<
  Input extends SchemaNodeInput<any> | string = SchemaNodeInput<any>,
  Output extends Input = Input>(input: Arrayable<Input>,
  fn: (node: Exclude<Input, IdReference>) => Input,
  options: ResolverOptions = {},
):
  Arrayable<Output | IdReference> {
  const ids = (Array.isArray(input) ? input : [input]).map((a) => {
    // filter out id references
    if (isIdReference(a))
      return a as IdReference
    return fn(a as Exclude<Input, IdReference>)
  }) as Arrayable<Exclude<Input, string>>
  // avoid arrays for single entries
  if (!options.array && ids.length === 1)
    return ids[0]
  return ids
}

export const includesType = <T extends SchemaNodeInput<any>>(node: T, type: string) => {
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

export const trimLength = (val: string, length: number) => {
  if (val.length > length) {
    const trimmedString = val.substring(0, length)
    return trimmedString.substring(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(' ')))
  }
  return val
}

export const resolveType = (val: Arrayable<string>, defaultType: Arrayable<string>) => {
  if (val === defaultType)
    return val
  const types = new Set<string>([
    ...(Array.isArray(defaultType) ? defaultType : [defaultType]),
    ...(Array.isArray(val) ? val : [val]),
  ])
  return types.size === 1 ? val : [...types.values()]
}

export const resolveWithBaseUrl = (base: string, urlOrPath: string) => {
  // can't apply base if there's a protocol
  if (!urlOrPath || hasProtocol(urlOrPath) || (!urlOrPath.startsWith('/') && !urlOrPath.startsWith('#')))
    return urlOrPath
  return withBase(urlOrPath, base)
}

export const resolveUrl = <T extends SchemaNode>(node: T, key: keyof T, prefix: string) => {
  if (node[key] && typeof node[key] === 'string')
    // @ts-expect-error untyped
    node[key] = resolveWithBaseUrl(prefix, node[key])
}

export const resolveId = <T extends SchemaNodeInput<any>>(node: T, prefix: string) => {
  if (node['@id'])
    node['@id'] = resolveWithBaseUrl(prefix, node['@id']) as Id
}

export const resolveRawId = (id: string) => {
  return id.substring(id.lastIndexOf('#')) as Id
}

/**
 * Removes attributes which have a null or undefined value
 */
export const cleanAttributes = (obj: any) => {
  Object.keys(obj).forEach((k) => {
    if (isRef(obj[k]))
      return
    if (obj[k] && typeof obj[k] === 'object') {
      cleanAttributes(obj[k])
      return
    }
    if (obj[k] === '' || obj[k] === null || typeof obj[k] === 'undefined')
      delete obj[k]
  })
  return obj
}

export const callAsPartial = <T extends (...args: any) => any>(fn: T, data: any): ReturnType<T> => fn(data || {})

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

export interface NodeResolverInput<Input, Resolved> {
  defaults?: DeepPartial<Resolved> | ((ctx: SchemaOrgContext) => DeepPartial<Resolved>)
  required?: (keyof Resolved)[]
  resolve?: (node: Input | Resolved, ctx: SchemaOrgContext) => Input | Resolved
  mergeRelations?: (node: Resolved, ctx: SchemaOrgContext) => void
}

export interface ResolvedRootNodeResolver<Input extends SchemaNodeInput<any>, ResolvedInput extends SchemaNodeInput<any> = Input> {
  resolve: (ctx: SchemaOrgContext) => ResolvedInput
  definition: NodeResolverInput<Input, ResolvedInput>
}

export function defineRootNodeResolver<Input extends MaybeRef<SchemaNodeInput<SchemaNode>>, ResolvedInput extends SchemaNode>(
  nodePartial: MaybeRef<Input>,
  definition: NodeResolverInput<Input, ResolvedInput>,
): ResolvedRootNodeResolver<Input, ResolvedInput> {
  const unrefedNodePartial = unref(nodePartial) as ResolvedInput
  return {
    definition,
    resolve(ctx: SchemaOrgContext) {
      // resolve defaults
      let defaults = definition?.defaults || {}
      if (typeof defaults === 'function')
        defaults = defaults(ctx)
        // defu user input with defaults
      const unresolvedNode = unref(defu(unrefedNodePartial, defaults)) as ResolvedInput
      if (unresolvedNode.image) {
        unresolvedNode.image = resolveImages(ctx, unresolvedNode.image, {
          resolvePrimaryImage: true,
          asRootNodes: true,
        })
      }
      let resolvedNode: ResolvedInput | null = null
      // allow the node to resolve itself
      if (definition.resolve)
        resolvedNode = definition.resolve(unresolvedNode, ctx) as ResolvedInput
      return cleanAttributes(resolvedNode ?? unresolvedNode)
    },
  }
}

export * from './ssr'
