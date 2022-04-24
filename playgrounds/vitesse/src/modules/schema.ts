import { installSchemaOrg } from 'vue-schema-org/vite'
import { type UserModule } from '~/types'

// Setup vue-schema-org
// https://schema-org.vueuse.com
export const install: UserModule = ctx =>
  installSchemaOrg(ctx, {
    canonicalHost: 'vitesse.example.com',
  })
