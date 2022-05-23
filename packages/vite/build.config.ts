import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  clean: true,
  declaration: true,
  rollup: {
    emitCJS: true,
  },
  entries: [
    { input: 'src/index' },
    { input: 'src/vitesse' },
    { input: 'src/vitepress' },
  ],
  externals: [
    '@vueuse/schema-org',
    'vue-router',
    'ufo',
    'schema-dts',
    'vue',
    '@vueuse/shared',
    '@vueuse/metadata',
    '@vue/composition-api',
  ],
})
