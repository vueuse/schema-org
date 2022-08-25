import { type UserModule } from '~/types'

// Setup @vueuse/schema-org
// https://schema-org.vueuse.com
export const install: UserModule = async (ctx) => {
  if (ctx.isClient && import.meta.env.PROD)
    return
  const { installSchemaOrg } = await import('@vueuse/schema-org-vite/vitesse')
  installSchemaOrg(ctx, {
    meta: {
      host: 'https://vitesse.example.com',
    },
    debug: true,
  })
}
