import {
  addPlugin,
  createResolver,
  defineNuxtModule,
} from '@nuxt/kit'
import type { SchemaOrgMeta, Thing } from '@vueuse/schema-org'

export interface ModuleOptions extends SchemaOrgMeta {
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
    // const runtimeDir = nuxt.options.alias['#schemaOrg'] || resolve(distDir, 'head/runtime')

    nuxt.options.build.transpile.push('@vueuse/schema-org')

    const { resolve } = createResolver(import.meta.url)

    addPlugin(resolve('./runtime/plugin'))

    // addTemplate({
    //   filename: 'schemaOrg.config.mjs',
    //   getContents: () => 'export default ' + JSON.stringify({ globalMeta, mixinKey: isNuxt3() ? 'created' : 'setup' })
    // })

    // const resolver = createResolver(import.meta.url)
    // addPluginTemplate({
    //   filename: 'use-schema-org.mjs',
    //   getContents: () => {
    //     const lines = [
    //       'import { createSchemaOrg } from \'@vueuse/schema-org\';',
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
