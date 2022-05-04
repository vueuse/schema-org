---
description: Learn how to start using Schema.org with @vueuse/schema-org in Vitesse.
---

# Adding Schema.org to Vitesse

Install the module to start using Schema.org with Vitesse.

## Install

```bash
# NPM
npm install -D @vueuse/schema-org-vite
# or Yarn
yarn add -D @vueuse/schema-org-vite
# or PNPM
pnpm add -D @vueuse/schema-org-vite
```

## Setup Module

### 1. Add Module

Create a file called `schema-org.ts` inside your `modules` folder.

```ts src/modules/schema-org.ts
import { installSchemaOrg } from '@vueuse/schema-org-vite/vitesse'
import { type UserModule } from '~/types'

// Setup @vueuse/schema-org
// https://schema-org.vueuse.com
export const install: UserModule = ctx =>
  installSchemaOrg(ctx, {
      /* config */
  })
```

### 2. Configure the module

To server-side render correctly and make appropriate Schema adjustments, the module requires the following:

- **canonicalHost** `string`

  The [canonical host](https://developers.google.com/search/docs/advanced/crawling/consolidate-duplicate-urls) of your site. You can conditionally swap this depending on the environment, but it's not needed, simply
  putting the production host is enough.


```ts {8}
import { installSchemaOrg } from '@vueuse/schema-org-vite/vitesse'
import { type UserModule } from '~/types'

// Setup @vueuse/schema-org
// https://schema-org.vueuse.com
export const install: UserModule = ctx =>
  installSchemaOrg(ctx, {
    canonicalHost: 'https://example.com'
  })
```

Check the [global configuration](/guide/global-config.html) if you'd like to provide any other values.


### Optional: Auto Imports

Modify your `vite.config.ts` to enable auto imports of all composables and components.

```ts vite.config.ts
import { SchemaOrgResolver, schemaOrgAutoImports } from '@vueuse/schema-org-vite'

export default defineConfig({
  plugins: [
    // ...
    Components({
      resolvers: [
        // auto-import schema-org components  
        SchemaOrgResolver(),
      ],
    }),
    AutoImport({
      imports: [
        // auto-import schema-org composables  
        schemaOrgAutoImports,
      ],
    }),
  ]
})
```

### 3. Configure Global Schema

To get all your pages up and running with Schema, you can make use [schema inheritance](/guide/how-it-works.html#schema-inheritance) and define
Schema in your `App.vue` file.

```vue
<script setup lang="ts">
useSchemaOrg([
  // https://vue-schema-org.netlify.app/guide/guides/identity.html
  // @todo select appropriate identity
  // https://vue-schema-org.netlify.app/schema/website.html
  defineWebSite({
    name: 'Nuxt - The Intuitive Vue Framework',
  }),
  // https://vue-schema-org.netlify.app/schema/webpage.html
  defineWebPagePartial(),
])
</script>
```

### 4. Optional: WebPage Configuration

With the global schema provided in your root component, every page will generate a [WebPage](/schema/webpage) entry.

In most cases you won't need to explicitly call `defineWebPage` again as
inferences will be made based on your pages meta.

In Vitesse you can provide route meta with a `yaml` script block.

```vue
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

Your site is now serving basic Schema.org for all pages, congrats! 🎉

The next steps are:
1. Choose an [Identity](/guide/guides/identity)
2. Get an understanding of [How it works](/guide/how-it-works)
3. Then feel free to add some custom recipes:

- [Breadcrumbs](/guide/recipes/breadcrumbs)
- [FAQ Page](/guide/recipes/faq)
- [Site Search](/guide/recipes/faq)
