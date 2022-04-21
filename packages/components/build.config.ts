import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  clean: true,
  declaration: true,
  rollup: {
    emitCJS: true,
    inlineDependencies: false,
  },
  entries: [
    { input: 'index' },
  ],
  externals: [
    'vueuse-schema-org',
    'vue-router',
    'ufo',
    'schema-dts',
    'vue',
    'vue-demi',
    '@vueuse/shared',
    '@vueuse/core',
    '@vueuse/metadata',
    '@vue/composition-api',
  ],
})
