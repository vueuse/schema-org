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
    'vue-demi',
    '@vueuse/schema-org',
    'vue-router',
    'ufo',
  ],
})
