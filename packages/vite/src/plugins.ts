import { createUnplugin } from 'unplugin'
import { resolvePath } from 'mlly'
import { dirname, join } from 'pathe'

export interface PluginOptions {
  mock: boolean
}

export const schemaOrgSwapAliases = () => createUnplugin<PluginOptions>((args) => {
  return {
    name: '@vueuse/schema-org:ssr-mock-plugin',
    enforce: 'pre',
    vite: {
      async config(config) {
        config.resolve = config.resolve || {}
        config.resolve.alias = config.resolve.alias || {}

        const SchemaOrgPkg = '@vueuse/schema-org'
        // avoid unwanted behavior with different package managers
        // @ts-expect-error untyped
        config.resolve.alias[SchemaOrgPkg] = dirname(await resolvePath(SchemaOrgPkg))

        if (args?.mock) {
          // @ts-expect-error untyped
          config.resolve.alias['#vueuse/schema-org/provider'] = '@vueuse/schema-org/runtime/mock'
          // @ts-expect-error untyped
          config.resolve.alias['#vueuse/schema-org/runtime'] = '@vueuse/schema-org/runtime/mock'
        }
        else {
          // @ts-expect-error untyped
          config.resolve.alias['#vueuse/schema-org/provider'] = await resolvePath(join(SchemaOrgPkg, 'lite'))
          // @ts-expect-error untyped
          config.resolve.alias['#vueuse/schema-org/runtime'] = await resolvePath(join(SchemaOrgPkg, 'runtime'))
        }
      },
    },
  }
})

export const SchemaOrg = (args: PluginOptions) => schemaOrgSwapAliases().vite(args)
