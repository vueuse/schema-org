---
description: Learn how to start using Schema.org with @vueuse/schema-org in VitePress.
dateModified: "2022-04-22"
datePublished: "2022-04-22"
---

# Adding Schema.org to VitePress

Install the module to start using Schema.org with VitePress.

::: warning
VitePress does not support custom SSR head management.
Schema.org will be rendered on the client side only.
:::

## Install

```bash
# NPM
npm install -D @vueuse/schema-org-vite @vueuse/head @vueuse/schema-org
# or Yarn
yarn add -D @vueuse/schema-org-vite @vueuse/head @vueuse/schema-org
# or PNPM
pnpm add -D @vueuse/schema-org-vite @vueuse/head @vueuse/schema-org
```

Note: This package depends on [@vueuse/head](https://github.com/vueuse/head/). 
The plugin will be automatically setup for you if you haven't already done so.

Note 2: dependency edge case with resolving the main package so including both are required.

## Setup Module

### 1. Add Module

Modify your `.vitepress/theme/index.ts` file to add the plugin.

```ts .vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme'
import { installSchemaOrg } from '@vueuse/schema-org-vite/vitepress'
import type { Theme } from 'vitepress/dist/client'

const theme: Theme = {
  ...DefaultTheme,
  enhanceApp(ctx) {
    installSchemaOrg(ctx, {
      /* config */
    })
  },
}

export default theme
```

### 2. Configure the module


To render Schema correctly and make appropriate Schema adjustments, the module requires the following:

- **canonicalHost** `string`

  The [canonical host](https://developers.google.com/search/docs/advanced/crawling/consolidate-duplicate-urls) of your site. You can conditionally swap this depending on the environment, but it's not needed, simply
  putting the production host is enough.

```ts {9}
import DefaultTheme from 'vitepress/theme'
import { installSchemaOrg } from '@vueuse/schema-org-vite/vitepress'
import type { Theme } from 'vitepress/dist/client'

const theme: Theme = {
  ...DefaultTheme,
  enhanceApp(ctx) {
    installSchemaOrg(ctx, {
      canonicalHost: 'https://example.com',
    })
  },
}

export default theme
```

Check the [global configuration](/guide/global-config.html) if you'd like to provide any other values.

### Optional: Auto Imports

If you're using `unplugin-vue-components` or `unplugin-auto-import`,
you can provide extra configuration for automatic imports.

Modify your `vite.config.ts` to get the auto-imports.

```ts vite.config.ts
import { SchemaOrgResolver, schemaOrgAutoImports } from '@vueuse/schema-org-vite'

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

### 3. Configure Global Schema

To get all your pages up and running with Schema, you can make use [schema inheritance](/guide/how-it-works.html#schema-inheritance) and define
Schema in your [Layout](https://vitepress.vuejs.org/guide/theming.html#layout-slots) file.

This allows all pages to inherit these Schemas, without them having to explicitly define them.

To add global Schema in VitePress, you need to override the default layout.

#### a. Composition API

```vue .vitepress/theme/MyLayout.vue
<script setup>
import DefaultTheme from 'vitepress/theme'
const { Layout } = DefaultTheme

useSchemaOrg([
  // https://vue-schema-org.netlify.app/guide/guides/identity.html
  // @todo select appropriate identity
  // https://vue-schema-org.netlify.app/schema/website.html
  defineWebSite({
    name: 'My Awesome Site',
  }),
  // https://vue-schema-org.netlify.app/schema/webpage.html
  defineWebPagePartial(),
])
</script>
</template>
```

#### a. Composition API

```vue .vitepress/theme/MyLayout.vue
<script setup>
import DefaultTheme from 'vitepress/theme'
const { Layout } = DefaultTheme

useSchemaOrg([
  // https://vue-schema-org.netlify.app/guide/guides/identity.html
  // @todo select appropriate identity
  // https://vue-schema-org.netlify.app/schema/website.html
  defineWebSite({
    name: 'My Awesome Site',
  }),
  // https://vue-schema-org.netlify.app/schema/webpage.html
  defineWebPagePartial(),
])
</script>
</template>
```

#### b. Component API

```vue .vitepress/theme/MyLayout.vue
<template>
  <!-- @todo choose an identity: https://vue-schema-org.netlify.app/guide/guides/identity.html -->
  <SchemaOrgWebSite name="My Awesome Website" />
  <SchemaOrgWebPage />
  <!-- ... -->
</template>
```

### 4. Optional: WebPage Configuration


With the global schema provided in your root component, every page will generate a [WebPage](/schema/webpage) entry.

In most cases you won't need to explicitly call `defineWebPage` again as
inferences will be made based on your pages meta.

When writing markdown files in VitePress you can provide page data through [frontmatter](https://vitepress.vuejs.org/guide/frontmatter.html).

For example, in this doc site we have the frontmatter as follows:

```vue guide/setup/vitepress.md
---
description: Learn how to start using Schema.org with @vueuse/schema-org in VitePress.
dateModified: "2022-04-22"
datePublished: "2022-04-22"
---
```

Now check the generated HTML for this page.

```html{9-11}
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
    },
    // ...
  ]
}</script>
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
