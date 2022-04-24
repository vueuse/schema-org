import {
  addPlugin, addTemplate,
  createResolver,
  defineNuxtModule,
} from '@nuxt/kit'
import type { SchemaOrgOptions, Thing } from 'vue-schema-org'

export interface ModuleOptions extends SchemaOrgOptions {
  graph?: Thing[]
}

export interface ModuleHooks {

}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    configKey: 'schemaOrg',
    compatibility: {
      bridge: true,
    },
  },
  async setup(config, nuxt) {
    nuxt.options.build.transpile.push('vue-schema-org')

    const { resolve } = createResolver(import.meta.url)

    addPlugin(resolve('./runtime/plugin'))

    addTemplate({
      filename: 'schemaOrg.config.mjs',
      getContents: () => `export default ${JSON.stringify({ config })}`,
    })

    // const resolver = createResolver(import.meta.url)
    // addPluginTemplate({
    //   filename: 'use-schema-org.mjs',
    //   getContents: () => {
    //     const lines = [
    //       'import { createSchemaOrg } from \'vue-schema-org\';',
    //       'import { useHead } from \'#imports\'',
    //       `createSchemaOrg({ head: useHead, canonicalHost: '${config.canonicalHost}' });`,
    //       'export default () => {};',
    //     ]
    //     console.log(lines.join('\n'))
    //     return lines.join('\n')
    //   },
    // })
  },
})
