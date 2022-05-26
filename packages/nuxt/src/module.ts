import {
  addComponent,
  addPlugin,
  addTemplate,
  createResolver,
  defineNuxtModule,
} from '@nuxt/kit'
import type { SchemaOrgOptions } from '@vueuse/schema-org'
import { schemaOrgAutoImports, schemaOrgComponents } from '@vueuse/schema-org'
import type { NuxtModule } from '@nuxt/schema'

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
      bridge: false,
    },
  },
  defaults: {
    autoImportComposables: true,
    autoImportComponents: true,
  },
  async setup(config, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    const runtimeDir = await resolve('./runtime')
    nuxt.options.build.transpile.push(runtimeDir)

    // switch plugin for ssr / spa
    addPlugin(resolve(runtimeDir, `plugin-${nuxt.options.ssr ? 'ssr' : 'spa'}.client`))
    // ssr may not be enabled, nuxt will handle that for us
    addPlugin(resolve(runtimeDir, 'plugin.server'))

    nuxt.options.build.transpile.push('@vueuse/schema-org')

    addTemplate({
      filename: 'schemaOrg.config.mjs',
      getContents: () => `export default ${JSON.stringify({ config })}`,
    })

    if (config.autoImportComposables) {
      nuxt.hooks.hookOnce('autoImports:sources', (autoImports) => {
        autoImports.unshift({
          from: resolve('./runtime/composables'),
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
}) as NuxtModule<ModuleOptions>
