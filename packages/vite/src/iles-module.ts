import { SchemaOrgResolver } from '@vueuse/schema-org'
import type { SchemaOrgPluginOptions } from '@vueuse/schema-org'
import type { IlesModule } from 'iles'
import type { UserConfig as IlesUserConfig } from 'iles/types/shared'
import { SchemaOrg } from '.'

export function schemaOrgIles(pluginOptions: SchemaOrgPluginOptions) {
  return <IlesModule> {
    name: '@vueuse-schema-org/schema-org-iles',
    components: {
      resolvers: [
        SchemaOrgResolver(),
      ],
    },
    config(config: IlesUserConfig) {
      config.vite = config.vite || {}
      // config.vite.optimizeDeps = config.vite.optimizeDeps || {}
      // config.vite.optimizeDeps.exclude = config.vite.optimizeDeps.exclude || []
      // config.vite.optimizeDeps.exclude.push(...['webpack-virtual-modules', 'unplugin', '@vueuse/schema-org/vite', '@vueuse/schema-org'])
      config.vite.plugins = config.vite.plugins || []
      config.vite.plugins.push(SchemaOrg({
        // use simple types
        full: false,
        // write type alias to tsconfig.json
        dts: true,
        // Note: iles will already strip out all javascript so we don't need to do it
        mock: false,
        ...pluginOptions,
      }))
    },
  }
}

