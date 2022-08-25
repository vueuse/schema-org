import { fileURLToPath } from 'node:url'
import { createUnplugin } from 'unplugin'
import MagicString from 'magic-string'
import { resolvePath } from 'mlly'
import { dirname, relative, resolve } from 'pathe'
import { readTSConfig, resolveTSConfig, writeTSConfig } from 'pkg-types'
import { createFilter } from '@rollup/pluginutils'
import { AliasRuntime, PkgName } from '../'
import type { SchemaOrgPluginOptions } from './types'

interface AliasPaths {
  pkg: string
  runtime: string
}

export default createUnplugin<SchemaOrgPluginOptions>((userConfig) => {
  userConfig = userConfig || {}
  let cachedPaths: AliasPaths
  let updatedTSConfig = false
  const fetchPaths = async (ctx: { root?: string }, force = false) => {
    if (cachedPaths && !force)
      return cachedPaths

    let base = import.meta.url.toString()
    if (base.startsWith('file://'))
      base = dirname(fileURLToPath(base))

    const pkg = resolve(base, '../')
    // dist folder
    let runtime
    if (userConfig?.mock) {
      runtime = await resolvePath(`${pkg}/runtime-mock`)
    }
    else {
      runtime = await resolvePath(`${pkg}/runtime-${userConfig?.full ? 'schema-dts' : 'simple'}`)

      // update types for whichever provider we're using
      if (!updatedTSConfig && userConfig.dts && ctx.root && process.env.NODE_ENV !== 'production') {
        let tsConfigFile: false | string = false
        try {
          tsConfigFile = await resolveTSConfig(ctx.root)
        }
        // it's fine if it fails
        catch {}
        if (tsConfigFile) {
          const tsconfig = await readTSConfig(tsConfigFile)
          tsconfig.compilerOptions = tsconfig.compilerOptions || {}
          tsconfig.compilerOptions.paths = tsconfig.compilerOptions.paths || {}
          const runtimeTsPath = `./${relative(ctx.root, `${runtime}/index`)}`
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
      await fetchPaths({ root: userConfig.root })
    },
    transformInclude(id) {
      // transform package files
      if (id.includes(cachedPaths.pkg))
        return true

      // transform users files
      if (userConfig.root && id.startsWith(userConfig.root)) {
        const filter = createFilter([
          /\.[jt]sx?$/,
          /\.vue$/,
        ], [
          'node_modules',
        ])
        return filter(id)
      }
      return false
    },
    transform(code) {
      // swap out aliases for real paths
      const s = new MagicString(code)
      s.replace(AliasRuntime, cachedPaths.runtime)
      if (s.hasChanged()) {
        return {
          code: s.toString(),
          map: s.generateMap(),
        }
      }
    },
    async webpack(compiler) {
      const { runtime } = await fetchPaths({ root: compiler.context })

      compiler.options.resolve.alias = {
        ...compiler.options.resolve.alias || {},
        [AliasRuntime]: runtime,
      }
    },
    vite: {
      async config(config, ctx) {
        const root = userConfig.root || config.root || process.cwd()
        let paths
        const isServerBuild = process.env.VITE_SSG || ctx.ssrBuild
        const isProduction = config.mode === 'production' || ctx.mode === 'production'
        if (typeof userConfig.mock === 'undefined' && !isServerBuild && isProduction) {
          userConfig.mock = true
          paths = await fetchPaths({ root }, true)
        }
        else {
          paths = await fetchPaths({ root })
        }

        const { pkg, runtime } = paths

        config.optimizeDeps = config.optimizeDeps || {}
        config.optimizeDeps.exclude = config.optimizeDeps.exclude || []
        config.optimizeDeps.exclude.push(...[runtime, pkg, PkgName])

        config.resolve = config.resolve || {}
        config.resolve.alias = config.resolve.alias || {}
        // @ts-expect-error untyped
        config.resolve.alias[AliasRuntime] = runtime
        return config
      },
    },
  }
})
