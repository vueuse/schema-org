import { SchemaOrgResolver } from '@vueuse/schema-org'
import type { IlesModule } from 'iles'
import type { UserConfig as IlesUserConfig } from 'iles/types/shared'

export function schemaOrgIles(_: any = {}) {
  return <IlesModule> {
    name: '@vueuse-schema-org/schema-org-iles',
    components: {
      resolvers: [
        SchemaOrgResolver(),
      ],
    },
    config(config: IlesUserConfig) {
      config.vite = config.vite || {}
      config.vite.plugins = config.vite.plugins || []
    },
  }
}

