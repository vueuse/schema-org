---
description: Learn how to start using Schema.org with @vueuse/schema-org.
dateModified: "2022-07-10"
datePublished: "2022-04-22"
---

#  <i-logos-vitejs class="text-25px" /> Adding Schema.org to Vite Projects

## Install

```bash
# NPM
npm install -D @vueuse/schema-org-vite @vueuse/head
# or Yarn
yarn add -D @vueuse/schema-org-vite @vueuse/head
# or PNPM
pnpm add -D @vueuse/schema-org-vite @vueuse/head
```

Note: This package depends on [@vueuse/head](https://github.com/vueuse/head/). The plugin will be automatically setup for you if you haven't already done so.

## Setup Module

### 1. Install Plugin

The first step is registering the Vue plugin.

Each framework has a different way of handling this, most should look like:

```js main.js
import { createApp } from 'vue'
import { createRouter } from 'vue-router'
import { createHead } from '@vueuse/head'
import { createSchemaOrg, useVueUseHead } from '@vueuse/schema-org'
import App from './App.vue'

const app = createApp(App)

const router = createRouter()
app.use(router)

const head = createHead()
app.use(head)

const schemaOrg = createSchemaOrg({
  provider: {
    useRoute: () => router.currentRoute,
    setupDOM: useVueUseHead(head)
  }
  /* config */
})
app.use(schemaOrg)
schemaOrg.setupDOM()

app.mount('#app')
```

### 2. Configure the module

- **canonicalHost** `string`

  The [canonical host](https://developers.google.com/search/docs/advanced/crawling/consolidate-duplicate-urls) of your site. You can conditionally swap this depending on the environment, but it's not needed, simply
  putting the production host is enough.

```js {18}
import { createApp } from 'vue'
import { createRouter } from 'vue-router'
import { createHead } from '@vueuse/head'
import { createSchemaOrg, useVueUseHead } from '@vueuse/schema-org'
import App from './App.vue'

const app = createApp(App)

const router = createRouter()
app.use(router)

const head = createHead()
app.use(head)

const schemaOrg = createSchemaOrg({
  provider: {
    useRoute: () => router.currentRoute,
    setupDOM: useVueUseHead(head)
  },
  /* config */
  canonicalHost: 'https://example.com',
})
schemaOrg.setupDOM()
app.use(schemaOrg)

app.mount('#app')
```

Check the [global configuration](/guide/global-config.html) if you'd like to provide any other values.


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

### 3. Configure Global Schema


To get all your pages up and running with Schema, you can make use [schema inheritance](/guide/how-it-works.html#schema-inheritance) and define
Schema in your `App.vue` file.

#### a. Composition API

```vue
<script setup lang="ts">
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

With the global schema provided in your root component, every page will generate a [WebPage](/api/schema/webpage) entry.

In most cases you won't need to explicitly call `defineWebPage` again as
inferences will be made based on your pages meta.

See [vue-router](https://router.vuejs.org/guide/advanced/meta.html#route-meta-fields) guide on route meta or [vueuse/head](https://github.com/vueuse/head/).

<details>
  <summary>a. useHead</summary>


Only supports the following inferences:
- title _`document.title`_
- description _`meta[name="description"]`_
- image _`meta[property="og:image"]`_

```vue
<script setup>
useHead({
  title: 'Hello World',
  meta: [ 
    { name: 'description',  content: 'This is a description' },
    { property: 'og:image',  content: 'https://example.com/preview.png' },
  ],
});
</script>
```
</details>

<br>

<details>
  <summary>b. defineWebPage</summary>

If you'd like full control over the WebPage data, you can define it again on any of the pages.

```vue
<script setup>
useSchemaOrg(
  defineWebPage({
    name: 'Hello World',
    description: 'This is a description',
    dateModified: new Date(2020, 1, 3),
    datePublished: new Date(2020, 1, 1),
    image: '/images/logo.png',
  })
)
</script>
```
</details>

### Next Steps

Your site is now serving basic Schema.org, congrats! 🎉

The next steps are:
1. Choose an [Identity](/guide/guides/identity)
2. Get an understanding of [How it works](/guide/how-it-works)
3. Then feel free to add some custom recipes:

- [Breadcrumbs](/guide/recipes/breadcrumbs)
- [FAQ Page](/guide/recipes/faq)
- [Site Search](/guide/recipes/faq)
