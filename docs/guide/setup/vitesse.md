---
description: Learn how to start using Schema.org with vueuse-schema-org in Vitesse.
---

# Adding Schema.org to Vitesse

## Install

```bash
# NPM
npm install -D vueuse-schema-org
# or Yarn
yarn add -D vueuse-schema-org
# or PNPM
pnpm add -D vueuse-schema-org
```

## Setup Module

### Module 

Create a file called `schema.ts` inside your `./modules` folder.

```ts schema.ts
import { installSchemaOrg } from 'vueuse-schema-org/vite'
import { type UserModule } from '~/types'

// Setup vueuse-schema-org
// https://schema-org.vueuse.com
export const install: UserModule = ctx =>
  installSchemaOrg(ctx, {
    // set to your production domain  
    canonicalHost: 'https://vitesse.com',
    // change to your default language
    defaultLanguage: 'en-US',
  })
```

### Optional: Auto Imports

Modify your `vite.config.ts` to get the auto-imports.

```ts vite.config.ts
import { SchemaOrgResolver, schemaOrgAutoImports } from 'vueuse-schema-org/vite'

export default defineConfig({
  plugins: [
    // ...
    Components({
      // ...
      resolvers: [
        // auto-import schema-org components  
        SchemaOrgResolver(),
      ],
    }),
    AutoImport({
      // ...
      imports: [
        // auto-import schema-org composables  
        schemaOrgAutoImports,
      ],
    }),
  ]
})
```

### Global Schema.org

It's time to add some Schema.org to your site. Go to your `App.vue` and place the following code in.

```vue
<script setup lang="ts">
useSchemaOrg([
  defineWebPage(),
  defineWebSite({
    // change me
    name: 'Vitesse',
  }),
  // @todo select an identity
])
</script>
```

### Route Meta Integration

The package comes with Schema.org inference from route meta. 
In Vitesse you can provide route meta with a `yaml` script block.

It's recommended for all public pages that you setup the `yaml` script block with at least a `title`.

```vue {3}
<route lang="yaml">
meta:
  title: About Vitesse
</route>
```

This will ensure the [WebPage](/schema/webpage) node uses the appropriate name.

```json{5}
{
  "@type": "WebPage",
  "@id": "https://vitesse.com/about#webpage",
  "url": "https://vitesse.com/about",
  "name": "About Vitesse",
  "isPartOf": {
    "@id": "https://schema-org.vueuse.com/#website"
  }
},
```

See [Route Meta Resolving](/guide/how-it-works.html#route-meta-resolving) for the full list of compatible route meta keys.

### Next Steps

Your site is now serving basic Schema.org, congrats! 🎉

The next steps are:
1. Choose an [Identity](/guide/guides/identity)
2. Get an understanding of [How it works](/guide/how-it-works)
3. Then feel free to add some custom recipes:

- [Breadcrumbs](/guide/recipes/breadcrumbs)
- [FAQ Page](/guide/recipes/faq)
- [Site Search](/guide/recipes/faq)
