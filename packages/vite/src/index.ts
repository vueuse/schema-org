import {
  AliasProvider,
  AliasRuntime,
  RootSchemas,
  schemaOrgComponents,
} from '@vueuse/schema-org'
import type { SchemaOrgResolverFn } from './types'

export * from './plugins'

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

export const schemaOrgAutoImports = {
  [AliasRuntime]: [
    'useSchemaOrg',
    'injectSchemaOrg',
  ],
  [AliasProvider]: RootSchemas
    .map(schema => [`define${schema}`])
    .flat(),
}

export { schemaOrgComponents }
