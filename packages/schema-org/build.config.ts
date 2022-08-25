import { defineBuildConfig } from 'unbuild'
import { copy, readFile, writeFile } from 'fs-extra'

export default defineBuildConfig({
  clean: true,
  declaration: true,
  rollup: {
    emitCJS: true,
  },
  entries: [
    { input: 'src/index' },
    { input: 'src/plugins/vite' },
    { input: 'src/plugins/webpack' },
    { input: 'runtime-simple/', outDir: 'dist/runtime-simple', builder: 'mkdist' },
    { input: 'runtime-mock/', outDir: 'dist/runtime-mock', builder: 'mkdist' },
  ],
  hooks: {
    'mkdist:done': async function (ctx) {
      const runtimeSimpleDir = `${ctx.options.outDir}/runtime-simple`
      const runtimeFullDir = `${ctx.options.outDir}/runtime-schema-dts`
      await copy(runtimeSimpleDir, runtimeFullDir)

      const simpleDtsFile = `${runtimeSimpleDir}/provider.d.ts`
      const simpleDts = await readFile(simpleDtsFile, { encoding: 'utf-8' })
      const fullDts = simpleDts
        .replace('from \'schema-org-graph-js\';', 'from \'schema-dts\';')
      await writeFile(`${runtimeFullDir}/provider.d.ts`, fullDts, { encoding: 'utf-8' })
    },
  },
  externals: [
    'vite',
    'unplugin-ast',
    'unplugin',
    'unplugin-vue-components',
    'vue',
  ],
})
