import { pathToFileURL } from 'node:url'
import {
  addAutoImport,
  addComponent,
  addPlugin,
  addTemplate,
  createResolver,
  defineNuxtModule,
} from '@nuxt/kit'
import type { SchemaOrgOptions } from '@vueuse/schema-org'
import { RootSchemas, schemaOrgComponents } from '@vueuse/schema-org/meta'
import type { NuxtModule } from '@nuxt/schema'
import { dirname } from 'pathe'
import { createUnplugin } from 'unplugin'
import MagicString from 'magic-string'
import { parseQuery, parseURL } from 'ufo'

export interface ModuleOptions extends SchemaOrgOptions {
  /**
   * Should schema.org only be rendered by the server.
   *
   * Useful for optimising performance as it may not be needed by search engines. Changes runtime package size to 0kb.
   */
  loadClientSide: boolean
  /**
   * Whether composables will be automatically imported for you.
   * @default true
   */
  autoImportComposables: boolean
  /**
   * Whether components will be automatically imported for you.
   * @default true
   */
  autoImportComponents: boolean
}

export interface ModuleHooks {

}

const SchemaOrgPkg = '@vueuse/schema-org'

export default defineNuxtModule<ModuleOptions>({
  meta: {
    configKey: 'schemaOrg',
    compatibility: {
      bridge: false,
    },
  },
  defaults: {
    loadClientSide: false,
    autoImportComposables: true,
    autoImportComponents: true,
  },
  async setup(config, nuxt) {
    const { resolve, resolvePath } = createResolver(import.meta.url)

    // avoid unwanted behavior with different package managers
    const schemaOrgPath = dirname(await resolvePath(SchemaOrgPkg))

    const runtimeDir = resolve('./runtime')
    const coreRuntimeDir = await resolvePath(`${schemaOrgPath}/runtime`)
    nuxt.options.build.transpile.push(runtimeDir)
    nuxt.options.build.transpile.push(coreRuntimeDir)

    if (nuxt.options.dev)
      config.loadClientSide = true

    // allow users to opt-out of client side scripts, if it's not dev
    if (config.loadClientSide)
      addPlugin(resolve(runtimeDir, 'plugin.client'))
    addPlugin(resolve(runtimeDir, 'plugin.server'))

    nuxt.options.alias[SchemaOrgPkg] = schemaOrgPath
    nuxt.options.alias['#useSchemaOrg'] = runtimeDir

    nuxt.hook('vite:extendConfig', (config) => {
      config.optimizeDeps = config.optimizeDeps || {}
      config.optimizeDeps.exclude = config.optimizeDeps.exclude || []
      config.optimizeDeps.exclude.push(...[schemaOrgPath, SchemaOrgPkg])
    })

    addTemplate({
      filename: 'schemaOrg.config.mjs',
      getContents: () => `export default ${JSON.stringify({ config })}`,
    })

    if (config.autoImportComposables) {
      nuxt.hooks.hook('autoImports:sources', (autoImports) => {
        autoImports.unshift({
          from: `${schemaOrgPath}/lite`,
          imports: RootSchemas.map(schema => [`define${schema}`]),
        })
      })
      addAutoImport({
        name: 'useSchemaOrg',
        from: resolve(runtimeDir, 'exports.ts'),
      })
    }

    if (config.autoImportComponents) {
      schemaOrgComponents.forEach((component) => {
        addComponent({
          name: component,
          export: component,
          chunkName: 'schema-org-components',
          filePath: `${coreRuntimeDir}/components.mjs`,
        })
      })
    }

    if (!config.loadClientSide) {
      const plugins = [
        createUnplugin(() => {
          return {
            name: 'nuxt-schema-org:mocker:post',
            enforce: 'post',
            transformInclude(id) {
              const { pathname, search } = parseURL(decodeURIComponent(pathToFileURL(id).href))
              const { type, macro } = parseQuery(search)

              // @todo ignore some node_modules
              // exclude node_modules by default
              // if ([/[\\/]node_modules[\\/]/].some(pattern => id.match(pattern)))
              //   return false

              if (
                pathname.endsWith('.vue')
                && (type === 'template' || type === 'script' || macro || !search)
              )
                return true

              // js files
              if (pathname.match(/\.((c|m)?j|t)sx?$/g))
                return true

              return false
            },
            transform(code, id) {
              const s = new MagicString(code)

              // swap our composables with mock composables
              s.replace(new RegExp(`${schemaOrgPath}/lite`, 'gm'), `${schemaOrgPath}/runtime/mock`)
              s.replace(/@vueuse\/schema-org\/lite/gm, `${schemaOrgPath}/runtime/mock`)
              // s.replace(new RegExp(schemaOrgPath, 'gm'), `${schemaOrgPath}/mock`)

              if (s.hasChanged()) {
                return {
                  code: s.toString(),
                  map: s.generateMap({ includeContent: true, source: id }),
                }
              }
            },
          }
        }).vite(),
      ]
      nuxt.hook('vite:extendConfig', (config, { isClient }) => {
        if (isClient) {
          config.plugins = config.plugins || []
          config.plugins.push(...plugins)
        }
      })
    }
  },
}) as NuxtModule<ModuleOptions>
