import { SchemaOrgUnheadPlugin } from '@vueuse/schema-org'
import type { ViteSSGContext } from 'vite-ssg'
import type { UserConfig } from '@vueuse/schema-org'

export function installSchemaOrg(ctx: ViteSSGContext, config: UserConfig) {
  // @ts-expect-error version mismatch
  if (!ctx.head!.unhead)
    return
  // @ts-expect-error version mismatch
  ctx.head!.unhead.hooks.addHooks(SchemaOrgUnheadPlugin(config, async () => {
    console.log('meta', ctx.router.currentRoute.value.path)
    return {
      path: ctx.router.currentRoute.value.path,
      ...ctx.router.currentRoute.value.meta,
    }
  }).hooks)
}
