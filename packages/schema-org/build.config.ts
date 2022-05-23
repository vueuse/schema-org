import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  clean: true,
  declaration: true,
  rollup: {
    emitCJS: true,
  },
  entries: [
    { input: 'index' },
    { input: 'components/index', name: 'components' },
  ],
  externals: [
    'consola',
    'vue',
    '@vueuse/head',
  ],
})
