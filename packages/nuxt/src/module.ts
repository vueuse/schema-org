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

    const moduleRuntime = resolve('./runtime')
    nuxt.options.build.transpile.push(...[moduleRuntime, RuntimeDir])

    if (typeof moduleOptions.client === 'undefined')
      moduleOptions.client = !!nuxt.options.dev

    // fallback clears schema on route change
    if (!moduleOptions.client)
      addPlugin(resolve(moduleRuntime, 'plugin-fallback.client'))

    addPlugin({
      src: resolve(moduleRuntime, 'plugin'),
      mode: moduleOptions.client ? 'all' : 'server',
    })

    // might need this again
    nuxt.options.alias[Pkg] = schemaOrgPath
    // set the alias for the types
    nuxt.options.alias['#vueuse/schema-org/provider'] = await resolvePath(`${schemaOrgPath}/providers/full`)
    nuxt.options.alias['#vueuse/schema-org/runtime'] = await resolvePath(`${schemaOrgPath}/runtime`)

    nuxt.hook('vite:extendConfig', (config, { isClient }) => {
      config.plugins = config.plugins || []
      config.plugins.push(SchemaOrgVitePlugin({
        mock: !moduleOptions.client && isClient,
        full: moduleOptions.full,
      }))
    })

    addTemplate({
      filename: 'nuxt-schema-org-config.mjs',
      getContents: () => `export default ${JSON.stringify(moduleOptions)}`,
    })

    nuxt.hooks.hook('autoImports:sources', (autoImports) => {
      autoImports.unshift({
        from: `${moduleRuntime}/composables`,
        imports: [
          'injectSchemaOrg',
        ],
      })
      autoImports.unshift({
        from: '#vueuse/schema-org/runtime',
        imports: [
          'useSchemaOrg',
        ],
      })
      autoImports.unshift({
        from: '#vueuse/schema-org/provider',
        imports: RootSchemas
          .map(schema => [`define${schema}`])
          .flat(),
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
