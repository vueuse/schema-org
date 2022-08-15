import { createUnplugin } from 'unplugin'
import { resolvePath } from 'mlly'
import { dirname } from 'pathe'

export interface PluginOptions {
  /**
   * Should the runtime be swapped out with a mock one, used for SSR-only mode.
   */
  mock?: boolean
  /**
   * Whether to use schema-dts types on define functions
   */
  full?: boolean
}

export const schemaOrgSwapAliases = () => createUnplugin<PluginOptions>((args) => {
  return {
    name: '@vueuse/schema-org:aliases',
    enforce: 'pre',
    vite: {
      async config(config, ctx) {
        config.resolve = config.resolve || {}
        config.resolve.alias = config.resolve.alias || {}
        args = args || {}

        if (typeof args.mock === 'undefined')
          args.mock = !ctx.ssrBuild

        const SchemaOrgPkg = '@vueuse/schema-org'
        // avoid unwanted behavior with different package managers

        // @ts-expect-error untyped
        config.resolve.alias[SchemaOrgPkg] = dirname(await resolvePath(SchemaOrgPkg))

        if (args?.mock) {
          const mockPath = await resolvePath(`${SchemaOrgPkg}/runtime/mock`)
          // @ts-expect-error untyped
          config.resolve.alias['#vueuse/schema-org/provider'] = mockPath
          // @ts-expect-error untyped
          config.resolve.alias['#vueuse/schema-org/runtime'] = mockPath
        }
        else {
          // @ts-expect-error untyped
          config.resolve.alias['#vueuse/schema-org/provider'] = await resolvePath(`${SchemaOrgPkg}/${args?.full ? 'full' : 'simple'}`)
          // @ts-expect-error untyped
          config.resolve.alias['#vueuse/schema-org/runtime'] = await resolvePath(`${SchemaOrgPkg}/runtime`)
        }
      },
    },
  }
})

export const SchemaOrg = (args: PluginOptions) => schemaOrgSwapAliases().vite(args)
