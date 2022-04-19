# Vitesse Schema.org

## Install

```bash
# NPM
npm install -D vueuse-schema-org
# or Yarn
yarn add -D vueuse-schema-org
# or PNPM
pnpm add -D vueuse-schema-org
```

## Usage

Add the following to your `./modules` folder

```ts
import { createSchemaOrg } from 'vueuse-schema-org'
import { type UserModule } from '~/types'
import { useHead } from '@vueuse/head'

// Setup vueuse-schema-org
// https://schema-org.vueuse.com
export const install: UserModule = (ctx) => {
  const schemaOrg = createSchemaOrg({
  // change host
  canonicalHost: 'vitesse.example.com',
  useHead,
  useRoute: () => ctx.router.currentRoute.value,
})
  ctx.app.use(schemaOrg)
}
```

Modify your `vite.config.ts` to get the autocompletions

```ts{11-15}
export default {
  plugins: [
    AutoImport({
      imports: [
       'vue',
       'vue-router',
       'vue-i18n',
       'vue/macros',
       '@vueuse/head',
       '@vueuse/core',
       {
+         'vueuse-schema-org': [
+             'useSchemaOrg'
+         ]
       }
      ],
    dts: 'src/auto-imports.d.ts',
    }),
  ]
}
```

## Next Steps
