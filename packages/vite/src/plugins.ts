import { createUnplugin } from 'unplugin'
import { resolvePath } from 'mlly'
import { dirname, join } from 'pathe'
import MagicString from 'magic-string'

export interface PluginOptions {
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
  aliasPaths?: {
    pkgDir?: string
    provider?: string
    runtime?: string
    mockPath?: string
  }
  /**
   * Scan files from this root directory (ignoring node_modules).
   */
  transformPaths?: string[]
}

const SchemaOrgPkg = '@vueuse/schema-org'

interface AliasPaths {
  mockPath?: string
  pkgDir: string
  provider: string
  runtime: string
}

export const schemaOrgSwapAliases = () => createUnplugin<PluginOptions>((args) => {
  args = args || {}
  let paths: AliasPaths
  const fetchPaths = async () => {
    if (paths)
      return paths
    const pkgDir = args.aliasPaths?.pkgDir || dirname(await resolvePath(SchemaOrgPkg))
    let provider, runtime
    if (args?.mock) {
      const mockPath = args.aliasPaths?.mockPath || await resolvePath(`${pkgDir}/runtime-mock`)
      provider = runtime = mockPath
    }
    else {
      provider = args.aliasPaths?.provider || await resolvePath(`${pkgDir}/providers/${args?.full ? 'full' : 'simple'}`)
      runtime = args.aliasPaths?.runtime || await resolvePath(`${pkgDir}/runtime`)
    }
    paths = {
      pkgDir,
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
      if (id.startsWith(join(paths.pkgDir, 'runtime')))
        return true
      for (const p of args?.transformPaths || []) {
        if (id.startsWith(p))
          return true
      }
      return false
    },
    transform(code) {
      // swap out aliases for real paths
      const s = new MagicString(code)
      s.replace('#vueuse/schema-org/provider', paths.provider)
      s.replace('#vueuse/schema-org/runtime', paths.runtime)

      return {
        code: s.toString(),
        map: s.generateMap(),
      }
    },
    vite: {
      async config(config, ctx) {
        const { pkgDir, provider, runtime } = await fetchPaths()

        config.resolve = config.resolve || {}
        config.resolve.alias = config.resolve.alias || {}

        if (typeof args.mock === 'undefined')
          args.mock = !ctx.ssrBuild
        // avoid unwanted behavior with different package managers
        // @ts-expect-error untyped
        config.resolve.alias[SchemaOrgPkg] = pkgDir
        // @ts-expect-error untyped
        config.resolve.alias['#vueuse/schema-org/provider'] = provider
        // @ts-expect-error untyped
        config.resolve.alias['#vueuse/schema-org/runtime'] = runtime
        return config
      },
    },
  }
})

export const SchemaOrg = (args: PluginOptions) => schemaOrgSwapAliases().vite(args)
