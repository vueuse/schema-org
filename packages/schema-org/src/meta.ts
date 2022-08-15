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
    from: '#vueuse/schema-org/runtime',
    imports: [
      'useSchemaOrg',
      'injectSchemaOrg',
    ],
  },
  {
    from: '#vueuse/schema-org/provider',
    imports: RootSchemas
      .map(schema => [`define${schema}`])
      .flat(),
  },
]

export const schemaOrgComponents = [
  'SchemaOrgInspector',
  ...RootSchemas.map(s => `SchemaOrg${s}`),
]
