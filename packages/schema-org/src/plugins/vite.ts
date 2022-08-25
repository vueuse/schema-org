import AliasRuntimePlugin from './alias'
import type { SchemaOrgPluginOptions } from './types'
import RemoveUseSchemaPlugin from './remove-use-schema'

export default (args: SchemaOrgPluginOptions = {}) => {
  const plugins = [
    AliasRuntimePlugin.vite(args),
  ]
  if (args.mock)
    plugins.push(RemoveUseSchemaPlugin.vite(args))
  return plugins
}
