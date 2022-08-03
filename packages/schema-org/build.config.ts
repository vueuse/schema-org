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
    { input: 'lite', name: 'lite' },
    { input: 'meta', name: 'meta' },
    { input: 'runtime/', outDir: 'dist/runtime', ext: 'mjs' },
  ],
  externals: [
    '#useSchemaOrg',
    'consola',
    'vue',
    'vue-demi',
    '@vueuse/head',
  ],
})
