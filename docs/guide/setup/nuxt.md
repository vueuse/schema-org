# <i-logos-nuxt-icon class="text-30px" /> Nuxt Schema.org

## Install

```bash
# NPM
npm install -D nuxt-schema-org
# or Yarn
yarn add -D nuxt-schema-org
# or PNPM
pnpm add -D nuxt-schema-org
```

## Setup Module

### Module

1. Add the module to your Nuxt config.

```ts nuxt.config.ts

export default defineNuxtConfig({
  buildModules: [
    'nuxt-schema-org',
  ],
})
```

2. Configure the module

Add your sites with your sites [canonical host](https://developers.google.com/search/docs/advanced/crawling/consolidate-duplicate-urls),
this is required for SSR.

```ts nuxt.config.ts
export default defineNuxtConfig({
  schemaOrg: {
    // set to your production domain  
    canonicalHost: 'https://vitesse.com',
    // change to your default language
    defaultLanguage: 'en-US',
  },
})
```

### Global Schema.org

The quickest way to get things up is to use the [recommended schema](/guide/how-it-works.html#recommended-schema) in your default layout file.

```vue layouts/default.vue
<script lang="ts" setup>
useSchemaOrg([
  defineWebPage(),
  defineWebSite({
    name: 'Nuxt v3',
  }),
  // @todo select an identity
])
</script>
```

### Optional: Disable Auto Imports

By default, all composable utilities and components are automatically imported for you. If you'd like to disable them, you can
use the config.

```ts nuxt.config.ts
export default defineNuxtConfig({
  schemaOrg: {
    disableAutoImports: true,
  },
})
```

### Next Steps

Your site is now serving basic Schema.org, congrats! 🎉

The next steps are:
1. Choose an [Identity](/guide/recipes/identity)
2. Get an understanding of [How it works](/guide/how-it-works)
3. Then feel free to add some custom recipes:

- [Breadcrumbs](/guide/recipes/breadcrumbs)
- [FAQ Page](/guide/recipes/faq)
- [Site Search](/guide/recipes/faq)
