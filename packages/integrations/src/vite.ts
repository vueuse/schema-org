import { schemaOrgAutoImports, schemaOrgComponents } from 'vue-schema-org'
import type { SchemaOrgResolverFn } from './types'

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
            from: 'vue-schema-org/components',
          }
        }
      }
    },
  }
}

export { schemaOrgComponents, schemaOrgAutoImports }
