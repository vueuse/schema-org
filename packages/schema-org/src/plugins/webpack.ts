import AliasRuntimePlugin from './alias'
import RemoveUseSchemaPlugin from './remove-use-schema'
import type { SchemaOrgPluginOptions } from './types'

export default (args: SchemaOrgPluginOptions = {}) => {
  const plugins = [
    AliasRuntimePlugin.webpack(args),
  ]
  if (args.mock)
    plugins.push(RemoveUseSchemaPlugin.webpack(args))
  return plugins
}
