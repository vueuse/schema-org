import { createSchemaOrg, resolveUserConfig } from '@vueuse/schema-org'
import type { EnhanceAppContext } from 'vitepress'
import { createHead } from '@vueuse/head'
import { watch } from 'vue'
import type { UserConfig } from '@vueuse/schema-org'

export function installSchemaOrg(ctx: EnhanceAppContext, config: UserConfig) {
  const resolvedConfig = resolveUserConfig(config)

  // check if `createHead` has already been done
  let head = ctx.app._context.provides.usehead
  if (!head) {
    head = createHead()
    ctx.app.use(head)
  }

  const client = createSchemaOrg({
    meta() {
      return {
        path: ctx.router.route.path,
        ...ctx.siteData.value,
        ...ctx.router.route.data,
        ...ctx.router.route.data.frontmatter,
        ...resolvedConfig.meta,
      }
    },
    updateHead(fn) {
      head.addHeadObjs(fn)
      if (typeof document !== 'undefined')
        head.updateDOM()
    },
  })

  watch(() => ctx.router.route.data.relativePath, () => {
    client.generateSchema()
  })

  ctx.app.use(client)
  client.setupDOM()
  return client
}
