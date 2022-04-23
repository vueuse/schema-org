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
    { input: 'integrations/vite', name: 'vite' },
    { input: 'integrations/vitepress', name: 'vitepress' },
  ],
  externals: [
    'vue-demi',
  ],
})
