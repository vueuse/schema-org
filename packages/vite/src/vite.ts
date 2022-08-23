import { createSchemaOrg, resolveUserConfig } from '@vueuse/schema-org'
import type { UserConfig } from '@vueuse/schema-org'
import type { App } from 'vue'
import { createHead } from '@vueuse/head'
import type { Router } from 'vue-router'

export function installSchemaOrg(ctx: { app: App; router?: Router }, config: UserConfig) {
  const resolvedConfig = resolveUserConfig(config)

  let head = ctx.app._context.provides.usehead
  if (!head) {
    head = createHead()
    ctx.app.use(head)
  }

  const client = createSchemaOrg({
    updateHead(fn) {
      head.addHeadObjs(fn)
      if (typeof document !== 'undefined')
        head.updateDOM()
    },
    meta() {
      // const inferredMeta: Record<string, any> = {}

      return {
        path: ctx.router?.currentRoute.value.path || '/',
        ...resolvedConfig.meta,
        ...ctx.router?.currentRoute.value.meta || {},
      }
    },
  })

  ctx.app.use(client)

  if (typeof document === 'undefined') {
    client.generateSchema()
    client.setupDOM()
    return
  }

  if (ctx.router) {
    ctx.router.afterEach(() => {
      client.generateSchema()
      client.setupDOM()
    })
  }
  return client
}
