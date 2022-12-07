import { defineApp } from 'iles'
import { SchemaOrgUnheadPlugin } from '@vueuse/schema-org'

export default defineApp({
  async enhanceApp(ctx) {
    ctx.head.use(SchemaOrgUnheadPlugin({
      // user config
      host: ctx.site.url,
    }, () => {
      // adds meta for runtime inferences
      return {
        path: ctx.router?.currentRoute.value.path || '/',
        ...ctx.meta,
        ...ctx.frontmatter,
        ...ctx.router?.currentRoute.value.meta || {},
      }
    }))
  },
})
