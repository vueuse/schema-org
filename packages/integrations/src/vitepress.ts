import type { SchemaOrgOptions } from 'vueuse-schema-org'
import { createSchemaOrg } from 'vueuse-schema-org'
import type { EnhanceAppContext } from 'vitepress'
import { createHead, useHead } from '@vueuse/head'

export function installSchemaOrg(ctx: EnhanceAppContext, options: SchemaOrgOptions) {
  const isServer = typeof window === 'undefined'

  // SSR does not work with VitePress due to custom head management
  if (isServer)
    return

  // check if `createHead` has already been done
  if (!ctx.app._context.provides.usehead) {
    const head = createHead()
    ctx.app.use(head)
  }

  const schemaOrg = createSchemaOrg({
    ...options,
    customRouteMetaResolver: () => {
      return {
        ...ctx.router.route.data,
        ...ctx.router.route.data.frontmatter,
      }
    },
    useHead,
    useRoute: () => ctx.router.route,
  })

  ctx.app.use(schemaOrg)
  return schemaOrg
}
