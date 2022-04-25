---
description: Learn how to start using Schema.org with @vueuse/schema-org in VitePress.
dateModified: "2022-04-22"
datePublished: "2022-04-22"
---

# Adding Schema.org to VitePress


::: warning
VitePress does not support custom SSR head management.
Schema.org will be rendered on the client side, Google states that it will still parse this.
:::

## Install

```bash
# NPM
npm install -D @vueuse/schema-org
# or Yarn
yarn add -D @vueuse/schema-org
# or PNPM
pnpm add -D @vueuse/schema-org
```


This package depends on `useHead` being available from `@vueuse/head`. You'll need to install this package
if you haven't already got it.

```bash
# NPM
npm install -D @vueuse/head
# or Yarn
yarn add -D @vueuse/head
# or PNPM
pnpm add -D @vueuse/head
```

## Setup Module

### Module

Modify your `.vitepress/theme/index.ts` file to add the plugin.

```ts .vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme'
import { installSchemaOrg } from '@vueuse/schema-org/vitepress'
import type { Theme } from 'vitepress/dist/client'

const theme: Theme = {
  ...DefaultTheme,
  enhanceApp(ctx) {
    installSchemaOrg(ctx, {
      // set to your production domain  
      canonicalHost: 'https://vitepress.com',
      // change to your default language
      defaultLanguage: 'en-US',
    })
  },
}

export default theme
```

### Optional: Auto Imports

If you're using `unplugin-vue-components` or `unplugin-auto-import`, you can provide extra configuration for automatic imports.

Modify your `vite.config.ts` to get the auto-imports.

```ts vite.config.ts
import { SchemaOrgResolver, schemaOrgAutoImports } from '@vueuse/schema-org/vite'

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

To add global Schema in VitePress, you need to override the default layout.

To add a default layout follow the VitePress [Layout slots](https://vitepress.vuejs.org/guide/theming.html#layout-slots) guide.

```vue .vitepress/theme/MyLayout.vue
<script setup>
import DefaultTheme from 'vitepress/theme'
const { Layout } = DefaultTheme

useSchemaOrg([
  defineWebPage(),
  defineWebSite({
    // change me
    name: 'VitePress',
  }),
  // @todo select an identity
])
</script>

<template>
<Layout>
  <template #page-bottom>
  <!-- Optionally render to debug the current schema -->
  <SchemaOrgInspector />
  </template>
</Layout>
</template>
```

### Route Meta Integration

When writing markdown files in VitePress you can provide page data through [Frontmatter](https://vitepress.vuejs.org/guide/frontmatter.html).

For example, in this doc site we have the frontmatter as follows:

```vue guide/setup/vitepress.md
---
description: Learn how to start using Schema.org with @vueuse/schema-org in VitePress.
dateModified: "2022-04-22"
datePublished: "2022-04-22"
---
```

Now check the generated HTML for this page.

```html{10-11}
<script type="application/ld+json">{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://vitepress.com/guide/setup/vitepress.html/#webpage",
      "url": "https://vitepress.com/guide/setup/vitepress.html",
      "name": "Adding Schema.org to VitePress",
      "description": "Learn how to start using Schema.org with @vueuse/schema-org in VitePress.",
      "dateModified": "2022-04-22T00:00:00.000Z",
      "datePublished": "2022-04-22T00:00:00.000Z",
      "potentialAction": [
        {
          "@type": "ReadAction",
          "target": [
            "https://vitepress.com/guide/setup/vitepress.html"
          ]
        }
      ],
      "isPartOf": {
        "@id": "https://vitepress.com/#website"
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://vitepress.com/#website",
      "url": "https://vitepress.com",
      "name": "VitePress",
      "publisher": {
        "@id": "https://vitepress.com/#identity"
      }
    },
    {
      "@type": "Organization",
      "@id": "https://vitepress.com/#identity",
      "url": "https://vitepress.com",
      "name": "Vue.js"
    }
  ]
}</script>
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
