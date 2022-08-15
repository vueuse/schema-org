import { createSchemaOrg } from '@vueuse/schema-org'
import type { EnhanceAppContext } from 'vitepress'
import { createHead } from '@vueuse/head'
import { watch } from 'vue-demi'
import type { MetaInput } from './'

export function installSchemaOrg(ctx: EnhanceAppContext, meta: MetaInput) {
  // check if `createHead` has already been done
  let head = ctx.app._context.provides.usehead
  if (!head) {
    head = createHead()
    ctx.app.use(head)
  }

  const client = createSchemaOrg({
    meta() {
      return {
        ...ctx.siteData.value,
        ...meta,
      }
    },
    updateHead(fn) {
      head.addHeadObjs(fn)
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
