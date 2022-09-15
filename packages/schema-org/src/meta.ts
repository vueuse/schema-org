import type { ComponentResolver } from 'unplugin-vue-components'
import type { BaseMetaInput, ResolvedUserConfig, UserConfig } from './types'

export const PkgName = '@vueuse/schema-org'
export const AliasRuntime = '@vueuse/schema-org/runtime'

export const RootSchemas = [
  'Article',
  'Breadcrumb',
  'Comment',
  'Event',
  'HowTo',
  'Image',
  'LocalBusiness',
  'Organization',
  'Person',
  'Product',
  'Question',
  'Recipe',
  'Review',
  'Video',
  'WebPage',
  'WebSite',
]

export interface SchemaOrgResolverOptions {
  /**
   * prefix for headless ui components used in templates
   *
   * @default ""
   */
  prefix?: string
}

export const schemaAutoImports = [
  'useSchemaOrg',
  ...RootSchemas
    .map(schema => [`define${schema}`])
    .flat(),
  'defineSearchAction',
  'defineReadAction',
]

export const schemaOrgAutoImports = [
  {
    from: AliasRuntime,
    imports: schemaAutoImports,
  },
]

export function resolveUserConfig(userConfig: UserConfig): ResolvedUserConfig {
  const meta = userConfig.meta || {} as BaseMetaInput
  if (!meta.host && userConfig.canonicalHost)
    meta.host = userConfig.canonicalHost
  if (!meta.inLanguage && userConfig.defaultLanguage)
    meta.inLanguage = userConfig.defaultLanguage
  if (!meta.currency && userConfig.defaultCurrency)
    meta.currency = userConfig.defaultCurrency
  return {
    ...userConfig,
    meta,
  }
}

export const schemaOrgComponents = [
  'SchemaOrgDebug',
  ...RootSchemas.map(s => `SchemaOrg${s}`),
]

export function SchemaOrgResolver(options: SchemaOrgResolverOptions = {}): ComponentResolver {
  const { prefix = '' } = options
  return {
    type: 'component',
    resolve: (name: string) => {
      if (name.startsWith(prefix)) {
        const componentName = name.substring(prefix.length)
        if (schemaOrgComponents.includes(componentName)) {
          return {
            name: componentName,
            from: AliasRuntime,
          }
        }
      }
    },
  }
}
