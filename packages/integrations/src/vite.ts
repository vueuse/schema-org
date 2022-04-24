import type { SchemaOrgResolverFn } from './types'

export const schemaOrgAutoImports = {
  'vue-schema-org': [
    'useSchemaOrg',
    // definitions
    'defineAggregateOffer',
    'defineAggregateRating',
    'defineArticle',
    'defineBreadcrumb',
    'defineComment',
    'defineHowTo',
    'defineImage',
    'defineLocalBusiness',
    'defineOffer',
    'defineOrganization',
    'definePerson',
    'definePostalAddress',
    'defineProduct',
    'defineQuestion',
    'defineRecipe',
    'defineReview',
    'defineSearchAction',
    'defineVideo',
    'defineWebPage',
    'defineWebSite',
  ],
}

const components = [
  'SchemaOrgBreadcrumb',
  'SchemaOrgQuestion',
  'SchemaOrgInspector',
]

export interface SchemaOrgResolverOptions {
  /**
   * prefix for headless ui components used in templates
   *
   * @default ""
   */
  prefix?: string
}

export function SchemaOrgResolver(options: SchemaOrgResolverOptions = {}): SchemaOrgResolverFn {
  const { prefix = '' } = options
  return {
    type: 'component',
    resolve: (name: string) => {
      if (name.startsWith(prefix)) {
        const componentName = name.substring(prefix.length)
        if (components.includes(componentName)) {
          return {
            name: componentName,
            from: 'vue-schema-org/components',
          }
        }
      }
    },
  }
}
