import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  clean: true,
  declaration: true,
  rollup: {
    emitCJS: true,
  },
  entries: [
    { input: 'index' },
  ],
  externals: [
    'schema-dts',
    'vue-demi',
    '@vueuse/shared',
    '@vueuse/core',
    '@vueuse/metadata',
    '@vue/composition-api',
  ],
})
