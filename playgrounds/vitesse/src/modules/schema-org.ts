import { createSchemaOrg } from '@vueuse/schema-org'
import { type UserModule } from '~/types'
import { useHead } from '@vueuse/head'

// Setup @vueuse/schema-org
// https://schema-org.vueuse.com
export const install: UserModule = (ctx) => {
  const schemaOrg = createSchemaOrg({
    canonicalHost: 'vitesse.example.com',
    useHead,
    useRoute: () => ctx.router.currentRoute.value,
  })
  ctx.app.use(schemaOrg)
}
