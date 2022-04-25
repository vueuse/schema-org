import {
  addComponent,
  addPlugin,
  addTemplate,
  createResolver,
  defineNuxtModule,
} from '@nuxt/kit'
import type { SchemaOrgOptions } from '@vueuse/schema-org'
import { schemaOrgAutoImports, schemaOrgComponents } from '@vueuse/schema-org'

export interface ModuleOptions extends SchemaOrgOptions {
  /**
   * Whether composables will be automatically imported for you.
   * @default true
   */
  autoImportComposables: boolean
  /**
   * Whether components will be automatically imported for you.
   * @default true
   */
  autoImportComponents: boolean
}

export interface ModuleHooks {

}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    configKey: 'schemaOrg',
    compatibility: {
      bridge: true,
    },
  },
  defaults: {
    autoImportComposables: true,
    autoImportComponents: true,
  },
  async setup(config, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    addPlugin(resolve('./runtime/plugin'))

    addTemplate({
      filename: 'schemaOrg.config.mjs',
      getContents: () => `export default ${JSON.stringify({ config })}`,
    })

    if (config.autoImportComposables) {
      nuxt.hook('autoImports:sources', (autoImports) => {
        autoImports.unshift({
          from: '@vueuse/schema-org',
          imports: schemaOrgAutoImports['@vueuse/schema-org'],
        })
      })
    }

    if (config.autoImportComponents) {
      schemaOrgComponents.forEach((component) => {
        addComponent({
          name: component,
          export: component,
          filePath: '@vueuse/schema-org',
        })
      })
    }
  },
})
