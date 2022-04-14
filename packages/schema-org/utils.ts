import type { OptionalMeta, SchemaOrgNode } from './types'
import type { SchemaOrgClient } from './createSchemaOrg'

export const idReference = (node: SchemaOrgNode|string) => {
  return {
    '@id': typeof node !== 'string' ? node['@id'] : node,
  }
}

export const setIfEmpty = <T extends SchemaOrgNode>(node: T, field: keyof T, value: any) => {
  if (!node?.[field])
    node[field] = value
}

export interface DefineSchemaOrgNode<T> {
  defaults?: Partial<T>
  resolve?: (node: T, client: SchemaOrgClient) => T
  mergeRelations?: (node: T, client: SchemaOrgClient) => void
}

export interface NodeResolver<T extends SchemaOrgNode = SchemaOrgNode> {
  nodePartial: OptionalMeta<T>
  definition: DefineSchemaOrgNode<T>
}

export function defineNodeResolverSchema<T extends SchemaOrgNode>(
  nodePartial: OptionalMeta<T>,
  definition: DefineSchemaOrgNode<T>,
): NodeResolver<T> {
  return {
    nodePartial,
    definition,
  }
}
