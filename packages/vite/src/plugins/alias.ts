import { createUnplugin } from 'unplugin'
import MagicString from 'magic-string'
import { resolvePath } from 'mlly'
import { dirname } from 'pathe'
import { AliasProvider, AliasRuntime, PkgName } from '@vueuse/schema-org'

export interface AliasPluginOptions {
  /**
   * Should the runtime be swapped out with a mock one, used for SSR-only mode.
   */
  mock?: boolean
  /**
   * Whether to use schema-dts types on define functions.
   */
  full?: boolean
  /**
   * Path to a real custom runtime (not mocked).
   */
  paths?: {
    pkg?: string
    provider?: string
    runtime?: string
    mock?: string
  }
}

interface AliasPaths {
  mock?: string
  pkg: string
  provider: string
  runtime: string
}

export const AliasRuntimePlugin = () => createUnplugin<AliasPluginOptions>((userConfig) => {
  userConfig = userConfig || {}
  let paths: AliasPaths
  const fetchPaths = async (force = false) => {
    if (paths && !force)
      return paths
    const pkg = userConfig.paths?.pkg || dirname(await resolvePath(PkgName))
    let provider, runtime
    if (userConfig?.mock) {
      const mock = userConfig.paths?.mock || `${pkg}/runtime-mock`
      provider = runtime = mock
    }
    else {
      provider = userConfig.paths?.provider || `${pkg}/providers/${userConfig?.full ? 'full' : 'simple'}`
      runtime = userConfig.paths?.runtime || `${pkg}/runtime`
    }
    paths = {
      pkg,
      provider,
      runtime,
    }
    return paths
  }

  return {
    name: '@vueuse/schema-org:aliases',
    enforce: 'pre',
    async buildStart() {
      await fetchPaths()
    },
    transformInclude(id) {
      return id.includes(paths.pkg)
    },
    transform(code) {
      // swap out aliases for real paths
      const s = new MagicString(code)
      s.replace(AliasProvider, paths.provider)
      s.replace(AliasRuntime, paths.runtime)

      if (s.hasChanged()) {
        return {
          code: s.toString(),
          map: s.generateMap(),
        }
      }
    },
    async webpack(compiler) {
      const { pkg, provider, runtime } = await fetchPaths()

      compiler.options.resolve.alias = {
        ...compiler.options.resolve.alias || {},
        [PkgName]: pkg,
        [AliasProvider]: provider,
        [AliasRuntime]: runtime,
      }
    },
    vite: {
      async config(config, ctx) {
        let paths
        const isServerBuild = process.env.VITE_SSG || ctx.ssrBuild
        if (typeof userConfig.mock === 'undefined' && !isServerBuild && config.mode === 'production') {
          userConfig.mock = true
          await fetchPaths(true)
          paths = await fetchPaths(true)
        }
        else {
          paths = await fetchPaths()
        }

        const { pkg, provider, runtime } = paths

        config.optimizeDeps = config.optimizeDeps || {}
        config.optimizeDeps.exclude = config.optimizeDeps.exclude || []
        config.optimizeDeps.exclude.push(...[runtime, provider, pkg, PkgName])

        config.resolve = config.resolve || {}
        config.resolve.alias = config.resolve.alias || {}
        // @ts-expect-error untyped
        config.resolve.alias[PkgName] = pkg
        // @ts-expect-error untyped
        config.resolve.alias[AliasProvider] = provider
        // @ts-expect-error untyped
        config.resolve.alias[AliasRuntime] = runtime
        return config
      },
    },
  }
})

export const AliasRuntimePluginWebpack = (args: AliasPluginOptions) => AliasRuntimePlugin().webpack(args)
export const AliasRuntimePluginVite = (args: AliasPluginOptions) => AliasRuntimePlugin().vite(args)
