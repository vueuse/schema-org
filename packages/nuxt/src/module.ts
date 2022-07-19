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
import { dirname } from 'pathe'
import { createUnplugin } from 'unplugin'
import MagicString from 'magic-string'

export interface ModuleOptions extends SchemaOrgOptions {
  /**
   * Should schema.org only be rendered by the server.
   *
   * Useful for optimising performance as it may not be needed by search engines. Changes runtime package size to 0kb.
   */
  disableRuntimeScriptsWhenSSR: boolean
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

const SchemaOrgPkg = '@vueuse/schema-org'

export default defineNuxtModule<ModuleOptions>({
  meta: {
    configKey: 'schemaOrg',
    compatibility: {
      bridge: false,
    },
  },
  defaults: {
    disableRuntimeScriptsWhenSSR: false,
    autoImportComposables: true,
    autoImportComponents: true,
  },
  async setup(config, nuxt) {
    const { resolve, resolvePath } = createResolver(import.meta.url)

    const runtimeDir = resolve('./runtime')
    nuxt.options.build.transpile.push(runtimeDir)

    const registerClientScripts = !config.disableRuntimeScriptsWhenSSR || nuxt.options.dev

    // allow users to opt-out of client side scripts, if it's not dev
    if (registerClientScripts)
      addPlugin(resolve(runtimeDir, 'plugin.client'))
    addPlugin(resolve(runtimeDir, 'plugin.server'))

    // avoid unwanted behavior with different package managers
    const schemaOrgPath = dirname(await resolvePath(SchemaOrgPkg))
    nuxt.options.alias[SchemaOrgPkg] = schemaOrgPath
    nuxt.options.build.transpile.push(...[schemaOrgPath, SchemaOrgPkg])

    nuxt.hook('vite:extendConfig', (config) => {
      config.optimizeDeps = config.optimizeDeps || {}
      config.optimizeDeps.exclude = config.optimizeDeps.exclude || []
      config.optimizeDeps.exclude.push(...[schemaOrgPath, SchemaOrgPkg])
    })

    addTemplate({
      filename: 'schemaOrg.config.mjs',
      getContents: () => `export default ${JSON.stringify({ config })}`,
    })

    if (config.autoImportComposables) {
      nuxt.hooks.hookOnce('autoImports:sources', (autoImports) => {
        autoImports.unshift({
          from: resolve('./runtime/composables'),
          imports: schemaOrgAutoImports[SchemaOrgPkg],
        })
      })
    }

    if (config.autoImportComponents) {
      schemaOrgComponents.forEach((component) => {
        addComponent({
          name: component,
          export: component,
          filePath: schemaOrgPath,
        })
      })
    }

    if (!registerClientScripts) {
      const mockTemplate = addTemplate({
        filename: 'schema-org-mock.mjs',
        getContents() {
          return schemaOrgAutoImports[SchemaOrgPkg]
            .map(s => `export function ${s}() {}`)
            .join('\n')
        },
      })
      addComponent({
        name: 'SchemaOrgMock',
        // use mock components if we don't need real ones
        export: 'SchemaOrgMock',
        filePath: schemaOrgPath,
      })
      nuxt.options.alias['#schema-org/mock'] = mockTemplate.dst!

      const mockerPlugin = createUnplugin(() => {
        return {
          name: 'nuxt-schema-org:mocker',
          enforce: 'post',
          transformInclude(id) {
            // only include users custom vue files
            return id.endsWith('.vue') && id.includes(nuxt.options.srcDir)
          },
          transform(code, id) {
            const s = new MagicString(code)

            // swap our composables with mock composables
            s.replace(resolve(runtimeDir, 'composables'), '#schema-org/mock')
            // replace components with mock components
            s.replace(/_resolveComponent\("SchemaOrg(.*?)"\)/gm, '_resolveComponent("SchemaOrgMock")')

            if (s.hasChanged()) {
              return {
                code: s.toString(),
                map: s.generateMap({ includeContent: true, source: id }),
              }
            }
          },
        }
      })

      nuxt.hook('vite:extendConfig', (config, { isClient }) => {
        if (isClient) {
          config.plugins = config.plugins || []
          config.plugins.push(mockerPlugin.vite())
        }
      })
    }
  },
}) as NuxtModule<ModuleOptions>
