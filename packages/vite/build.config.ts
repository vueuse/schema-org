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
  ],
  externals: [
    '@vueuse/schema-org',
    'vue-router',
    'vue',
  ],
})
