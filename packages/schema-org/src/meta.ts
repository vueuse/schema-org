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

export const schemaOrgComponents = [
  'SchemaOrgInspector',
  ...RootSchemas.map(s => `SchemaOrg${s}`),
]
