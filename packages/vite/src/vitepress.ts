// @ts-expect-error untyped
import type { ProviderOptions } from '@vueuse/schema-org'
import { createSchemaOrg } from '@vueuse/schema-org'
import type { EnhanceAppContext } from 'vitepress'
import { createHead } from '@vueuse/head'
import { watch } from 'vue-demi'

export function installSchemaOrg(ctx: EnhanceAppContext, options: ProviderOptions) {
  // check if `createHead` has already been done
  let head = ctx.app._context.provides.usehead
  if (!head) {
    head = createHead()
    ctx.app.use(head)
  }

  const schemaOrg = createSchemaOrg({
    ...options,
    meta() {
      return {
        ...ctx.siteData.value,
      }
    },
    updateHead(fn) {
      head.addHeadObjs(fn)
      head.updateDOM()
    },
  })

  watch(() => ctx.router.route.data.relativePath, () => {
    // @todo
  })

  ctx.app.use(schemaOrg)
  schemaOrg.setupDOM()
  return schemaOrg
}
