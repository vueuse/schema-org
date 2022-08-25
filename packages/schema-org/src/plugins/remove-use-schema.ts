import { createUnplugin } from 'unplugin'
import { createFilter } from '@rollup/pluginutils'
import type { Transformer } from 'unplugin-ast'
import { transform } from 'unplugin-ast'
import type { CallExpression } from '@babel/types'
import MagicString from 'magic-string'
import type { SchemaOrgPluginOptions } from './types'

export const RemoveFunctions = (functionNames: string[]): Transformer<CallExpression> => ({
  onNode: node =>
    node.type === 'CallExpression'
    && node.callee.type === 'Identifier'
    && functionNames.includes(node.callee.name),

  transform(node) {
    node.arguments = []
    return node
  },
})

export default createUnplugin<SchemaOrgPluginOptions>((userConfig = {}) => {
  const filter = createFilter([
    /\.[jt]sx?$/,
    /\.vue$/,
  ], [
    'node_modules',
  ])
  let root = userConfig.root

  return {
    name: '@vueuse/schema-org:remove-use-schema',
    enforce: 'post',

    transformInclude(id) {
      // make sure we run on files from root
      if (root && !id.startsWith(root))
        return false
      return filter(id)
    },

    async transform(code, id) {
      const s = new MagicString(code)

      const transformed = await transform(code, id, {
        parserOptions: {},
        transformer: [
          RemoveFunctions(['useSchemaOrg']),
        ],
      })

      if (!transformed)
        return undefined

      s.remove(0, code.length)
      s.prepend(transformed.code.replace('(useSchemaOrg());', ''))
      return {
        code: s.toString(),
        get map() {
          return s.generateMap({
            source: id,
            includeContent: true,
          })
        },
      }
    },
    vite: {
      async config(config) {
        root = root || config.root || process.cwd()
      },
    },
  }
})
