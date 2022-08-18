import { defineBuildConfig } from 'unbuild'
import { copy, readFile, rename, writeFile } from 'fs-extra'

export default defineBuildConfig({
  clean: true,
  declaration: true,
  rollup: {
    emitCJS: true,
  },
  entries: [
    { input: 'src/index' },
    { input: 'providers/', outDir: 'dist/providers', builder: 'mkdist' },
    { input: 'runtime/', outDir: 'dist/runtime', builder: 'mkdist' },
    { input: 'runtime-mock/', outDir: 'dist/runtime-mock', builder: 'mkdist' },
  ],
  hooks: {
    'mkdist:done': async function (ctx) {
      const simpleDtsFile = `${ctx.options.outDir}/providers/simple.d.ts`
      const simpleDts = await readFile(simpleDtsFile, { encoding: 'utf-8' })
      const fullDts = simpleDts
        .replace('from \'schema-org-graph-js\';', 'from \'schema-dts\';')
      await writeFile(`${ctx.options.outDir}/providers/full.d.ts`, fullDts, { encoding: 'utf-8' })
      await rename(simpleDtsFile, `${ctx.options.outDir}/providers/simple.d.ts`)
      await copy(`${ctx.options.outDir}/providers/simple.mjs`, `${ctx.options.outDir}/providers/full.mjs`)
    },
  },
  externals: [
    '#vueuse/schema-org',
    'vue',
  ],
})
