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
    { input: 'src/vite' },
    { input: 'src/iles-app' },
    { input: 'src/iles-module' },
  ],
  externals: [
    'iles',
    '@vueuse/head',
    'vite-ssg',
    'vitepress',
    '@vueuse/schema-org',
    'vue-router',
    'vue',
  ],
})
