import { installSchemaOrg } from 'vueuse-schema-org/vite'
import { type UserModule } from '~/types'

// Setup vueuse-schema-org
// https://schema-org.vueuse.com
export const install: UserModule = ctx =>
  installSchemaOrg(ctx, {
    canonicalHost: 'vitesse.example.com',
  })
