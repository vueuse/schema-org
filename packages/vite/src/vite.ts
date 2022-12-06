import type { UserConfig } from '@vueuse/schema-org'
import { SchemaOrgUnheadPlugin } from '@vueuse/schema-org'
import type { App } from 'vue'
import type { HeadClient } from '@vueuse/head'
import { createHead } from '@vueuse/head'
import type { Router } from 'vue-router'

export function installSchemaOrg(ctx: { app: App; router?: Router }, config: UserConfig) {
  let head = ctx.app._context.provides.usehead as HeadClient
  if (!head) {
    head = createHead()
    ctx.app.use(head)
  }

  // @ts-expect-error version mismatch
  if (!ctx.head!.unhead)
    return
  const currentRoute = ctx.router!.currentRoute
  // @ts-expect-error version mismatch
  head.unhead.hooks.addHooks(SchemaOrgUnheadPlugin(config, async () => {
    const route = currentRoute.value
    return {
      ...config,
      path: route.path,
      ...route.meta,
    }
  }).hooks)
}
