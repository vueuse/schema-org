import {
  addComponent,
  addPlugin,
  addTemplate,
  createResolver,
  defineNuxtModule,
} from '@nuxt/kit'
import type { MetaInput, UserConfig } from '@unhead/schema-org-vue'
import { schemaOrgAutoImports, schemaOrgComponents } from '@unhead/schema-org-vue'
import type { NuxtModule } from '@nuxt/schema'

export interface ModuleOptions extends UserConfig {}

export interface ModuleHooks {

}

declare module '@nuxt/schema' {
  export interface RuntimeNuxtHooks {
    'schema-org:meta': (meta: MetaInput) => void
  }
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-schema-org',
    configKey: 'schemaOrg',
    compatibility: {
      nuxt: '^3.0.0',
      bridge: false,
    },
  },
  defaults(nuxt) {
    const trailingSlash = process.env.NUXT_PUBLIC_TRAILING_SLASH || nuxt.options.runtimeConfig.public.trailingSlash
    return {
      host: process.env.NUXT_PUBLIC_SITE_URL || nuxt.options.runtimeConfig.public?.siteUrl,
      trailingSlash: typeof trailingSlash !== 'undefined' ? trailingSlash : false,
    }
  },
  async setup(config, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    // set the runtime alias so nuxt knows where our types are
    const moduleRuntimeDir = resolve('./runtime')

    nuxt.options.build.transpile.push(...[
      moduleRuntimeDir,
      '@vueuse/schema-org',
      '@unhead/schema-org-vue',
    ])

    addPlugin({
      src: resolve(moduleRuntimeDir, 'plugin'),
      mode: (nuxt.options.dev || !nuxt.options.ssr) ? 'all' : 'server',
    })

    nuxt.options.alias['#nuxt-schema-org/config'] = addTemplate({
      filename: 'nuxt-schema-org-config.mjs',
      getContents: () => `export default ${JSON.stringify(config)}`,
    }).dst

    for (const component of schemaOrgComponents) {
      await addComponent({
        name: component,
        export: component,
        chunkName: 'nuxt-schema-org/components',
        filePath: '@unhead/schema-org-vue',
      })
    }

    nuxt.hooks.hook('imports:sources', (autoImports) => {
      autoImports.unshift(...schemaOrgAutoImports)
    })
  },
}) as NuxtModule<ModuleOptions>
