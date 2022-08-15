import { defineConfig } from 'vite'
import Components from 'unplugin-vue-components/vite'
import WindiCSS from 'vite-plugin-windicss'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { SchemaOrg, SchemaOrgResolver, schemaOrgAutoImports } from '@vueuse/schema-org-vite'

export default defineConfig(async () => {
  return {
    plugins: [
      Components({
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        dts: true,
        resolvers: [
          SchemaOrgResolver(),
          IconsResolver(),
        ],
      }),
      SchemaOrg({
        mock: false,
      }),
      // https://github.com/antfu/unplugin-auto-import
      AutoImport({
        include: [
          /\.vue$/, /\.vue\?vue/, // .vue
        ],
        imports: [
          'vue',
          schemaOrgAutoImports,
        ],
        dts: 'src/auto-imports.d.ts',
      }),
      Icons({
        autoInstall: true,
      }),
      WindiCSS({
        scan: {
          dirs: [
            __dirname,
          ],
        },
      }),
    ],

    optimizeDeps: {
      include: [
        'vue',
      ],
      exclude: [
        '@vueuse/head',
      ],
    },
  }
})
