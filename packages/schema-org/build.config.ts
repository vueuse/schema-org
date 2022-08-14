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
    { input: 'src/index' },
    { input: 'providers/lite' },
    { input: 'runtime/', outDir: 'dist/runtime', builder: 'mkdist' },
    { input: 'runtime-mock/', outDir: 'dist/runtime-mock', builder: 'mkdist' },
  ],
  externals: [
    '#vueuse/schema-org',
    'consola',
    'vue',
    'vue-demi',
    '@vueuse/head',
  ],
})
