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
   * @default false
   */
  full?: boolean
  /**
   * Metadata for the schema.org generation
   */
  meta?: MetaInput
}

export interface ModuleHooks {

}

const Pkg = '@vueuse/schema-org'

export default defineNuxtModule<ModuleOptions>({
  meta: {
    configKey: 'schemaOrg',
    compatibility: {
      bridge: false,
    },
  },
  async setup(moduleOptions, nuxt) {
    const { resolve, resolvePath } = createResolver(import.meta.url)

    // avoid unwanted behavior with different package managers
    const schemaOrgPath = dirname(await resolvePath(Pkg))

    const moduleRuntimeDir = resolve('./runtime')
    nuxt.options.build.transpile.push(...[moduleRuntimeDir, AliasRuntime])

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
