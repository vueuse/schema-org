import {
  addAutoImport, addAutoImportDir,
  addPlugin,
  clearRequireCache, createResolver,
  defineNuxtModule,
  importModule, resolveModule,
} from '@nuxt/kit'

export interface ModuleOptions {
}

export interface ModuleHooks {

}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    configKey: 'seoKit',
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
    addAutoImportDir(resolver.resolve('./runtime/composables'))

  },
})
