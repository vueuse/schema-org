import type { ComponentResolver } from 'unplugin-vue-components'
import type { BaseMetaInput, ResolvedUserConfig, UserConfig } from './types'

export const PkgName = '@vueuse/schema-org'
export const AliasRuntime = '@vueuse/schema-org/runtime'

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
  'defineAddress',
  'defineAggregateOffer',
  'defineAggregateRating',
  'defineArticle',
  'defineBreadcrumb',
  'defineComment',
  'defineEvent',
  'defineVirtualLocation',
  'definePlace',
  'defineHowTo',
  'defineHowToStep',
  'defineImage',
  'defineLocalBusiness',
  'defineOffer',
  'defineOpeningHours',
  'defineOrganization',
  'definePerson',
  'defineProduct',
  'defineQuestion',
  'defineRecipe',
  'defineReview',
  'defineVideo',
  'defineWebPage',
  'defineWebSite',
  'defineBook',
  'defineCourse',
  'defineItemList',
  'defineMovie',
  'defineSearchAction',
  'defineReadAction',
  'defineSoftwareApp',
  'defineBookEdition',
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
  'SchemaOrgArticle',
  'SchemaOrgBreadcrumb',
  'SchemaOrgComment',
  'SchemaOrgEvent',
  'SchemaOrgHowTo',
  'SchemaOrgImage',
  'SchemaOrgLocalBusiness',
  'SchemaOrgOrganization',
  'SchemaOrgPerson',
  'SchemaOrgProduct',
  'SchemaOrgQuestion',
  'SchemaOrgRecipe',
  'SchemaOrgReview',
  'SchemaOrgVideo',
  'SchemaOrgWebPage',
  'SchemaOrgWebSite',
  'SchemaOrgMovie',
  'SchemaOrgCourse',
  'SchemaOrgItemList',
  'SchemaOrgBook',
  'SchemaOrgSoftwareApp',
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
