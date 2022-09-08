import {
  addComponent,
  addPlugin,
  addTemplate,
  createResolver,
  defineNuxtModule,
  extendWebpackConfig,
  importModule,
} from '@nuxt/kit'
import type { UserConfig } from '@vueuse/schema-org'
import { AliasRuntime, resolveUserConfig, schemaOrgAutoImports, schemaOrgComponents } from '@vueuse/schema-org'
import type { NuxtModule } from '@nuxt/schema'
import type { MetaInput } from 'schema-org-graph-js'
import { dirname } from 'pathe'

export interface ModuleOptions extends UserConfig {}

export interface ModuleHooks {

}

declare module 'nuxt' {
  export interface RuntimeNuxtHooks {
    'schema-org:meta': (meta: MetaInput) => void
  }
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

    // if ssr is disabled we need to inject the client
    if (!nuxt.options.ssr)
      moduleOptions.client = true
    // enable client in dev mode
    if (typeof moduleOptions.client === 'undefined')
      moduleOptions.client = !!nuxt.options.dev

    // set the runtime alias so nuxt knows where our types are
    const pkgPath = dirname(await resolvePath(Pkg))
    nuxt.options.alias[AliasRuntime] = `${pkgPath}/runtime-${moduleOptions.full ? 'schema-dts' : 'simple'}`

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

    nuxt.hooks.hook('imports:sources', (autoImports) => {
      autoImports.unshift(...schemaOrgAutoImports)
    })

    // Support Vite
    nuxt.hooks.hook('vite:extendConfig', async (config, { isClient }) => {
      config.plugins = config.plugins || []
      const SchemaOrgVite = await importModule(`${pkgPath}/vite`, { interopDefault: true })
      config.plugins.push(SchemaOrgVite({
        root: nuxt.options.rootDir,
        dts: false,
        mock: !moduleOptions.client && isClient,
        full: moduleOptions.full,
      }))
    })

    // Support webpack
    extendWebpackConfig(async (config) => {
      config.plugins = config.plugins || []
      const SchemaOrgWebpack = await importModule(`${pkgPath}/webpack`, { interopDefault: true })
      const plugins = SchemaOrgWebpack({
        root: nuxt.options.rootDir,
        dts: false,
        mock: !moduleOptions.client && config.name === 'client',
        full: moduleOptions.full,
      })
      config.plugins.push(...plugins)
    })
  },
}) as NuxtModule<ModuleOptions>
