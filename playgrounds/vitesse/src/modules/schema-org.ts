import { installSchemaOrg } from '@vueuse/schema-org-vite/vitesse'
import { type UserModule } from '~/types'

// Setup @vueuse/schema-org
// https://schema-org.vueuse.com
export const install: UserModule = (ctx) => {
  console.log(ctx)
  installSchemaOrg(ctx, {
    meta: {
      host: 'vitesse.example.com',
    },
    debug: true,
  })
}
