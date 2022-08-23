import type { BaseMetaInput, ResolvedUserConfig, UserConfig } from './types'

export const PkgName = '@vueuse/schema-org'
export const AliasRuntime = '#vueuse/schema-org/runtime'
export const AliasProvider = '#vueuse/schema-org/provider'

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

export const schemaOrgAutoImports = [
  {
    from: AliasRuntime,
    imports: [
      'useSchemaOrg',
      'injectSchemaOrg',
    ],
  },
  {
    from: AliasProvider,
    imports: RootSchemas
      .map(schema => [`define${schema}`])
      .flat(),
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

export const schemaOrgComponents = RootSchemas.map(s => `SchemaOrg${s}`)
