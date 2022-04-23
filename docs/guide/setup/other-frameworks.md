---
description: Learn how to start using Schema.org with vueuse-schema-org.
dateModified: "2022-04-22"
datePublished: "2022-04-22"
---

#  <i-logos-vue class="text-25px" /> Adding Schema.org to Vue Projects

## Install

```bash
# NPM
npm install -D vueuse-schema-org
# or Yarn
yarn add -D vueuse-schema-org
# or PNPM
pnpm add -D vueuse-schema-org
```

### Recommended Dependencies

The package aims to:
- reduce boilerplate config for pages where possible
- avoid re-investing the wheel

For these reasons,
it's highly recommended
you use [@vueuse/head](https://github.com/vueuse/head) and [vue-router](https://router.vuejs.org/) as dependencies.

It's not required to use these though as you're able to provide your own function to resolve the current route and 
method for appending the schema tag.


## Setup Module

### Vue Plugin

The first step is registering the Vue plugin.
Each framework has a different way of handling this, but the basis would look like this:

```js main.js
import { createApp } from 'vue'
import { createSchemaOrg } from 'vueuse-schema-org'
import App from './App.vue'

const app = createApp(App)

const schemaOrg = createSchemaOrg({
  // set to your production domain  
  canonicalHost: 'https://vitepress.com',
  // change to your default language
  defaultLanguage: 'en-US',
})
app.use(schemaOrg)

app.mount('#app')
```


### Optional: Auto Imports

If you're using `unplugin-vue-components` or `unplugin-auto-import`, you can provide extra configuration for automatic imports.

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

To start embedding the Schema into your pages, you'll need to use a `useSchemaOrg` in either your `App.vue` file or your
default layout file.

For example:

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

See [vue-router](https://router.vuejs.org/guide/advanced/meta.html#route-meta-fields) guide on route meta.

If you have an alias function for defining route meta, use that.

### Next Steps

Your site is now serving basic Schema.org, congrats! 🎉

The next steps are:
1. Choose an [Identity](/guide/recipes/identity)
2. Get an understanding of [How it works](/guide/how-it-works)
3. Then feel free to add some custom recipes:

- [Breadcrumbs](/guide/recipes/breadcrumbs)
- [FAQ Page](/guide/recipes/faq)
- [Site Search](/guide/recipes/faq)
