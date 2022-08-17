import {
  addComponent,
  addPlugin,
  addTemplate,
  createResolver,
  defineNuxtModule,
} from '@nuxt/kit'
import type { MetaInput } from 'schema-org-graph-js'
import { AliasProvider, AliasRuntime, schemaOrgAutoImports, schemaOrgComponents } from '@vueuse/schema-org'
import type { NuxtModule } from '@nuxt/schema'
import { dirname } from 'pathe'
import { SchemaOrg as SchemaOrgVitePlugin } from '@vueuse/schema-org-vite'

export interface ModuleOptions {
  /**
   * Should schema.org only be rendered by the server.
   *
   * Useful for optimising performance as it may not be needed by search engines. Changes runtime package size to 0kb.
   *
   * @default false
   */
  client?: boolean
  /**
   * Should full schema types from `schema-dts` be used over a simplified version.
   *
   * @default false
   */
  full?: boolean
  /**
   * Extra default metadata for the schema.org generation, you can use this as an alternative to the other meta.
   */
  meta?: MetaInput
  /**
   * The production URL of your site. This allows the client to generate all URLs for you and is important to set correctly.
   */
  canonicalHost?: `https://${string}`
  /**
   * Will set the `isLanguage` to this value for any Schema which uses it. Should be a valid language code, i.e `en-AU`
   */
  defaultLanguage?: string
  /**
   * Will set the `priceCurrency` for [Product](/schema/product) Offer Schema. Should be a valid currency code, i.e `AUD`
   */
  defaultCurrency?: string
  /**
   * @deprecated You can remove this option, it doesn't do anything now.
   */
  debug?: boolean
}

export interface ModuleHooks {

}

const Pkg = '@vueuse/schema-org'

export default defineNuxtModule<ModuleOptions>({
  meta: {
    configKey: 'schemaOrg',
    compatibility: {
      nuxt: '>=3.0.0-rc.8',
      bridge: false,
    },
  },
  async setup(moduleOptions, nuxt) {
    const { resolve, resolvePath } = createResolver(import.meta.url)

    moduleOptions.meta = moduleOptions.meta || {} as MetaInput
    if (!moduleOptions.meta.host && moduleOptions.canonicalHost)
      moduleOptions.meta.host = moduleOptions.canonicalHost
    if (!moduleOptions.meta.inLanguage && moduleOptions.defaultLanguage)
      moduleOptions.meta.inLanguage = moduleOptions.canonicalHost
    if (!moduleOptions.meta.currency && moduleOptions.defaultCurrency)
      moduleOptions.meta.currency = moduleOptions.canonicalHost

    // spa we can read the window.origin as a fallback
    if (nuxt.options.ssr && !moduleOptions.canonicalHost && !moduleOptions.meta?.host) {
      console.warn('WARN [nuxt-schema-org] Please provide a `canonicalHost` to use this module with SSR enabled.')
      return
    }

    // avoid unwanted behavior with different package managers
    const schemaOrgPath = dirname(await resolvePath(Pkg))

    const moduleRuntimeDir = resolve('./runtime')
    nuxt.options.build.transpile.push(...[moduleRuntimeDir, AliasRuntime])

    // if ssr is disabled we need to inject the client
    if (!nuxt.options.ssr)
      moduleOptions.client = true
    // enable client in dev mode
    if (typeof moduleOptions.client === 'undefined')
      moduleOptions.client = !!nuxt.options.dev

    const providerPath = await resolvePath(`${schemaOrgPath}/providers/${moduleOptions.full ? 'full' : 'simple'}`)
    // // set the alias for the types
    nuxt.options.alias[AliasProvider] = providerPath
    nuxt.options.alias[AliasRuntime] = '@vueuse/schema-org/runtime'
    // might need this
    nuxt.options.alias[Pkg] = schemaOrgPath

    // fallback clears schema on route change
    if (!moduleOptions.client)
      addPlugin(resolve(moduleRuntimeDir, 'plugin-fallback.client'))

    addPlugin({
      src: resolve(moduleRuntimeDir, 'plugin'),
      mode: moduleOptions.client ? 'all' : 'server',
    })

    addTemplate({
      filename: 'nuxt-schema-org-config.mjs',
      getContents: () => `export default ${JSON.stringify(moduleOptions)}`,
    })

    for (const component of schemaOrgComponents) {
      await addComponent({
        name: component,
        export: component,
        chunkName: 'nuxt-schema-org/components',
        filePath: AliasRuntime,
      })
    }

    nuxt.hooks.hook('autoImports:sources', (autoImports) => {
      autoImports.unshift(...schemaOrgAutoImports)
    })

    nuxt.hooks.hook('vite:extendConfig', (config, { isClient }) => {
      config.optimizeDeps = config.optimizeDeps || {}
      config.optimizeDeps.exclude = config.optimizeDeps.exclude || []
      config.optimizeDeps.exclude.push(...[`${schemaOrgPath}/runtime`, Pkg])

      config.plugins = config.plugins || []
      config.plugins.push(SchemaOrgVitePlugin({
        mock: !moduleOptions.client && isClient,
        full: moduleOptions.full,
        aliasPaths: {
          provider: providerPath,
          pkgDir: schemaOrgPath,
        },
      }))
    })
  },
}) as NuxtModule<ModuleOptions>
