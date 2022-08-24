import { createUnplugin } from 'unplugin'
import MagicString from 'magic-string'
import { resolvePath } from 'mlly'
import { dirname, relative } from 'pathe'
import { AliasProvider, AliasRuntime, PkgName } from '@vueuse/schema-org'
import { readTSConfig, resolveTSConfig, writeTSConfig } from 'pkg-types'

export interface AliasPluginOptions {
  /**
   * Whether the tsconfig.json should be updated with the aliases.
   */
  dts?: boolean
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
  let cachedPaths: AliasPaths
  let updatedTSConfig = false
  const fetchPaths = async (ctx: { root?: string }, force = false) => {
    if (cachedPaths && !force)
      return cachedPaths
    const pkg = userConfig.paths?.pkg || dirname(await resolvePath(PkgName))
    let provider, runtime
    if (userConfig?.mock) {
      const mock = userConfig.paths?.mock || `${pkg}/runtime-mock`
      provider = runtime = mock
    }
    else {
      provider = userConfig.paths?.provider || `${pkg}/providers/${userConfig?.full ? 'full' : 'simple'}`
      runtime = userConfig.paths?.runtime || `${pkg}/runtime`

      // update types for whichever provider we're using
      if (!updatedTSConfig && userConfig.dts && ctx.root && process.env.NODE_ENV !== 'production') {
        const tsConfigFile = await resolveTSConfig(ctx.root)
        if (tsConfigFile) {
          const tsconfig = await readTSConfig(tsConfigFile)
          tsconfig.compilerOptions = tsconfig.compilerOptions || {}
          tsconfig.compilerOptions.paths = tsconfig.compilerOptions.paths || []
          const providerTsPath = relative(ctx.root, provider)
          if (tsconfig.compilerOptions.paths[AliasProvider]?.[0] !== providerTsPath) {
            tsconfig.compilerOptions.paths[AliasProvider] = [providerTsPath]
            updatedTSConfig = true
          }

          const runtimeTsPath = relative(ctx.root, `${runtime}/index`)
          if (tsconfig.compilerOptions.paths[AliasRuntime]?.[0] !== runtimeTsPath) {
            tsconfig.compilerOptions.paths[AliasRuntime] = [runtimeTsPath]
            updatedTSConfig = true
          }

          if (updatedTSConfig)
            await writeTSConfig(tsConfigFile, tsconfig)
          // avoid checking again this run
          updatedTSConfig = true
        }
      }
    }

    const resolvedPaths = {
      pkg,
      provider,
      runtime,
    }
    if (ctx.root)
      cachedPaths = resolvedPaths
    return resolvedPaths
  }

  return {
    name: '@vueuse/schema-org:aliases',
    enforce: 'pre',
    async buildStart() {
      await fetchPaths({})
    },
    transformInclude(id) {
      return id.includes(cachedPaths.pkg)
    },
    transform(code) {
      // swap out aliases for real paths
      const s = new MagicString(code)
      s.replace(AliasProvider, cachedPaths.provider)
      s.replace(AliasRuntime, cachedPaths.runtime)

      if (s.hasChanged()) {
        return {
          code: s.toString(),
          map: s.generateMap(),
        }
      }
    },
    async webpack(compiler) {
      const { provider, runtime } = await fetchPaths({ root: compiler.context })

      compiler.options.resolve.alias = {
        ...compiler.options.resolve.alias || {},
        [AliasProvider]: provider,
        [AliasRuntime]: runtime,
      }
    },
    vite: {
      async config(config, ctx) {
        const root = config.root || process.cwd()
        let paths
        const isServerBuild = process.env.VITE_SSG || ctx.ssrBuild
        if (typeof userConfig.mock === 'undefined' && !isServerBuild && config.mode === 'production') {
          userConfig.mock = true
          paths = await fetchPaths({ root }, true)
        }
        else {
          paths = await fetchPaths({ root })
        }

        const { pkg, provider, runtime } = paths

        config.optimizeDeps = config.optimizeDeps || {}
        config.optimizeDeps.exclude = config.optimizeDeps.exclude || []
        config.optimizeDeps.exclude.push(...[runtime, provider, pkg, PkgName])

        config.resolve = config.resolve || {}
        config.resolve.alias = config.resolve.alias || {}
        // @ts-expect-error untyped
        config.resolve.alias[AliasProvider] = provider
        // @ts-expect-error untyped
        config.resolve.alias[AliasRuntime] = runtime
        return config
      },
    },
  }
})

export const AliasRuntimePluginWebpack = (args?: AliasPluginOptions) => AliasRuntimePlugin().webpack(args || {})
export const AliasRuntimePluginVite = (args?: AliasPluginOptions) => AliasRuntimePlugin().vite(args || {})
export const SchemaOrg = AliasRuntimePluginVite
