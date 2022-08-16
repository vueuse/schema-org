import {
  addComponent,
  addPlugin,
  addTemplate,
  createResolver,
  defineNuxtModule,
} from '@nuxt/kit'
import type { MetaInput } from 'schema-org-graph-js'
import { RootSchemas, schemaOrgComponents } from '@vueuse/schema-org'
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

  meta?: MetaInput
}

export interface ModuleHooks {

}

const Pkg = '@vueuse/schema-org'
const RuntimeDir = '#vueuse/schema-org/runtime'

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
    nuxt.options.build.transpile.push(...[moduleRuntimeDir, RuntimeDir])

    if (typeof moduleOptions.client === 'undefined')
      moduleOptions.client = !!nuxt.options.dev

    // fallback clears schema on route change
    if (!moduleOptions.client)
      addPlugin(resolve(moduleRuntimeDir, 'plugin-fallback.client'))

    addPlugin({
      src: resolve(moduleRuntimeDir, 'plugin'),
      mode: moduleOptions.client ? 'all' : 'server',
    })

    const nuxtSchemaComposablesRuntime = `${moduleRuntimeDir}/composables`

    addTemplate({
      filename: 'nuxt-schema-org-config.mjs',
      getContents: () => `export default ${JSON.stringify(moduleOptions)}`,
    })

    const componentPath = await resolvePath('@vueuse/schema-org/components')
    for (const component of schemaOrgComponents) {
      await addComponent({
        name: component,
        export: component,
        chunkName: 'schema-org-components',
        filePath: componentPath,
      })
    }

    nuxt.hooks.hook('autoImports:sources', (autoImports) => {
      autoImports.unshift({
        from: nuxtSchemaComposablesRuntime,
        imports: [
          'injectSchemaOrg',
          'useSchemaOrg',
        ],
      })

      autoImports.unshift({
        from: '#vueuse/schema-org/provider',
        imports: [
          ...RootSchemas
            .map(schema => [`define${schema}`])
            .flat(),
        ],
      })
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
          pkgDir: schemaOrgPath,
          runtime: nuxtSchemaComposablesRuntime,
        },
      }))
    })
  },
}) as NuxtModule<ModuleOptions>
