import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  clean: true,
  declaration: true,
  rollup: {
    emitCJS: true,
    esbuild: {
      target: 'es2019',
    },
  },
  entries: [
    { input: 'index' },
    { input: 'components/index', name: 'components' },
  ],
  externals: [
    'consola',
    'vue',
    'vue-demi',
    '@vueuse/head',
  ],
})
