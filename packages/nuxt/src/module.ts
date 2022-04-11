import {
  createResolver,
  defineNuxtModule,
  addPluginTemplate,
} from '@nuxt/kit'

export interface ModuleOptions {
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
  defaults() {
    return {
    }
  },
  async setup(config, nuxt) {
    const resolver = createResolver(import.meta.url)
    // addPlugin(resolver.resolve('runtime/plugin/fetch'))

    // for (const method of ['get', 'patch', 'put', 'post', 'delete', 'options']) {
    //   addAutoImportDir(resolver.resolve('composables'))
    // }
    addPluginTemplate({
      filename: 'use-schema-org.mjs',
      getContents: () => {
        const lines = [
          'import { useSchemaOrgMeta } from \'@vueuse/schema-org\';',
          'import { useRoute } from \'#imports\';',
          `useSchemaOrgMeta({ routeResolver: useRoute, ...${JSON.stringify(config)} });`,
          'export default () => {};',
        ]
        console.log(lines)
        return lines.join('\n')
      },
    })

    // addAutoImportDir(resolver.resolve('./runtime/composables'))
  },
})
