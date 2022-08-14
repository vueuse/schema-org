import {
  addComponent,
  addPlugin,
  addTemplate,
  createResolver,
  defineNuxtModule,
} from '@nuxt/kit'
import { RootSchemas, schemaOrgComponents } from '@vueuse/schema-org'
import type { NuxtModule } from '@nuxt/schema'
import { dirname } from 'pathe'
// @ts-expect-error untyped
import { SchemaOrg as SchemaOrgVitePlugin } from '@vueuse/schema-org-vite'

export interface ModuleOptions {
  /**
   * Should schema.org only be rendered by the server.
   *
   * Useful for optimising performance as it may not be needed by search engines. Changes runtime package size to 0kb.
   *
   * @default false
   */
  client: boolean

  meta?: {
    /**
     * The production URL of your site. This allows the client to generate all URLs for you and is important to set correctly.
     */
    canonicalHost?: string
    /**
     * Will set the `isLanguage` to this value for any Schema which uses it. Should be a valid language code, i.e `en-AU`
     */
    defaultLanguage?: string
    /**
     * Will set the `priceCurrency` for [Product](/schema/product) Offer Schema. Should be a valid currency code, i.e `AUD`
     */
    defaultCurrency?: string
  }
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
    client: false,
  },
  async setup(moduleOptions, nuxt) {
    const { resolve, resolvePath } = createResolver(import.meta.url)

    // avoid unwanted behavior with different package managers
    const schemaOrgPath = dirname(await resolvePath(SchemaOrgPkg))

    const runtimeDir = resolve('./runtime')
    const coreRuntimeDir = await resolvePath(`${schemaOrgPath}/runtime`)
    nuxt.options.build.transpile.push(runtimeDir)
    nuxt.options.build.transpile.push(coreRuntimeDir)

    // if (nuxt.options.dev)
    //   config.loadClientSide = true

    // allow users to opt-out of client side scripts, if it's not dev
    if (!moduleOptions.client)
      addPlugin(resolve(runtimeDir, 'plugin-fallback.client'))

    addPlugin({
      src: resolve(runtimeDir, 'plugin'),
      mode: moduleOptions.client ? 'all' : 'server',
    })

    // might need this again
    nuxt.options.alias[SchemaOrgPkg] = schemaOrgPath

    nuxt.hook('vite:extendConfig', (config, { isClient }) => {
      config.optimizeDeps = config.optimizeDeps || {}
      config.optimizeDeps.exclude = config.optimizeDeps.exclude || []
      config.optimizeDeps.exclude.push(SchemaOrgPkg)

      config.plugins = config.plugins || []
      config.plugins.push(SchemaOrgVitePlugin({
        mock: isClient,
      }))
    })

    addTemplate({
      filename: 'nuxt-schema-org-config.mjs',
      getContents: () => `export default ${JSON.stringify(moduleOptions)}`,
    })

    nuxt.hooks.hook('autoImports:sources', (autoImports) => {
      autoImports.unshift({
        from: `${runtimeDir}/composables`,
        imports: [
          'useSchemaOrg',
          'injectSchemaOrg',
          ...RootSchemas
            .map(schema => [`define${schema}`])
            .flat(),
        ],
      })
    })

    schemaOrgComponents.forEach((component) => {
      addComponent({
        name: component,
        export: component,
        chunkName: 'schema-org-components',
        filePath: '#vueuse/schema-org/runtime',
      })
    })
  },
}) as NuxtModule<ModuleOptions>
