import {
  addComponent,
  addPlugin,
  addTemplate,
  createResolver,
  defineNuxtModule, extendWebpackConfig,
} from '@nuxt/kit'
import { AliasProvider, AliasRuntime, resolveUserConfig, schemaOrgAutoImports, schemaOrgComponents } from '@vueuse/schema-org'
import type { NuxtModule } from '@nuxt/schema'
import { dirname } from 'pathe'
import type { UserConfig } from '@vueuse/schema-org'
import { AliasRuntimePluginVite, AliasRuntimePluginWebpack } from '@vueuse/schema-org-vite'

export interface ModuleOptions extends UserConfig {}

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

    moduleOptions = resolveUserConfig(moduleOptions)

    // spa we can read the window.origin as a fallback
    if (nuxt.options.ssr && !moduleOptions.canonicalHost && !moduleOptions.meta?.host) {
      console.warn('WARN [nuxt-schema-org] Please provide a `canonicalHost` to use this module with SSR enabled.')
      return
    }

    // avoid unwanted behavior with different package managers
    const schemaOrgPath = dirname(await resolvePath(Pkg))

    // if ssr is disabled we need to inject the client
    if (!nuxt.options.ssr)
      moduleOptions.client = true
    // enable client in dev mode
    if (typeof moduleOptions.client === 'undefined')
      moduleOptions.client = !!nuxt.options.dev

    const providerPath = await resolvePath(`${schemaOrgPath}/providers/${moduleOptions.full ? 'full' : 'simple'}`)
    const runtimePath = await resolvePath(`${schemaOrgPath}/runtime`)
    const runtimeMockPath = await resolvePath(`${schemaOrgPath}/runtime-mock`)
    // // set the alias for the types
    nuxt.options.alias[AliasProvider] = providerPath
    nuxt.options.alias[AliasRuntime] = runtimePath
    // might need this
    nuxt.options.alias[Pkg] = schemaOrgPath

    const moduleRuntimeDir = resolve('./runtime')
    nuxt.options.build.transpile.push(...[moduleRuntimeDir, AliasRuntime])

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

    // allow SchemaOrgDebug to work in build modes
    await addComponent({
      name: 'SchemaOrgDebug',
      export: 'SchemaOrgDebug',
      filePath: `${schemaOrgPath}/runtime/components/SchemaOrgDebug`,
    })

    nuxt.hooks.hook('autoImports:sources', (autoImports) => {
      autoImports.unshift(...schemaOrgAutoImports)
    })

    const realPaths = {
      runtime: runtimePath,
      provider: providerPath,
      pkg: schemaOrgPath,
    }
    const mockPaths = {
      runtime: runtimeMockPath,
      provider: runtimeMockPath,
      pkg: schemaOrgPath,
    }

    // Support Vite
    nuxt.hooks.hook('vite:extendConfig', (config, { isClient }) => {
      config.plugins = config.plugins || []
      config.plugins.push(AliasRuntimePluginVite({
        paths: (!moduleOptions.client && isClient)
          ? mockPaths
          : realPaths,
      }))
    })

    // Support webpack
    extendWebpackConfig((config) => {
      config.plugins = config.plugins || []
      config.plugins.push(AliasRuntimePluginWebpack({
        paths: realPaths,
      }))
    }, {
      client: false,
      modern: false,
      server: true,
    })
    extendWebpackConfig((config) => {
      config.plugins = config.plugins || []
      config.plugins.push(AliasRuntimePluginWebpack({
        paths: !moduleOptions.client
          ? mockPaths
          : realPaths,
      }))
    }, {
      client: true,
      modern: true,
      server: false,
    })
  },
}) as NuxtModule<ModuleOptions>
