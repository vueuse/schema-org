const schemas = [
  'Article',
  'Breadcrumb',
  'Comment',
  'HowTo',
  'Image',
  'LocalBusiness',
  'Organization',
  'Person',
  'Product',
  'Question',
  'Recipe',
  'Video',
  'WebPage',
  'WebSite',
]

export const schemaOrgAutoImports = {
  '@vueuse/schema-org': [
    'useSchemaOrg',
    // definitions
    ...schemas
      .map(schema => [`define${schema}`, `define${schema}Partial`])
      .flat(),
    'asSearchAction',
    'asReadAction',
  ],
}

export const schemaOrgComponents = [
  'SchemaOrgBreadcrumb',
  'SchemaOrgQuestion',
  'SchemaOrgInspector',
]
