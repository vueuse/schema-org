<script setup>
import { useSchemaOrg, defineHowTo } from '@vueuse/schema-org'

useSchemaOrg(
  defineHowTo({
    name: 'Install Schema.org on Nuxt',
    description: 'Install the module to start using Schema.org with Nuxt v3.',
    totalTime: 'PT2M',
    image: '/og.png',
    step: [
        {
          name: 'Install dependencies',
          url: '#install',
          itemListElement: [
            { text: 'Within your console run the following: `npm install -d nuxt-schema-org`.' }
          ]
        },
      {
        name: 'Setup module',
        url: '#setup-module',
        itemListElement: [
          { text: 'Add the module to your Nuxt config.' },
          { text: 'Configure the module using the `schemaOrg` key in your nuxt.config.ts file.' }
        ]
      },
    ]
  })
)
</script>

# <i-logos-nuxt-icon class="text-30px" /> Install Schema.org on Nuxt

Install the module to start using Schema.org with Nuxt v3. 

⚠️ Not tested with Nuxt bridge or Nuxt v2.

<a href="https://stackblitz.com/edit/nuxt-starter-z9np1t?file=app.vue" target="_blank">
  <img alt="Open in StackBlitz" src="https://camo.githubusercontent.com/bf5c9492905b6d3b558552de2c848c7cce2e0a0f0ff922967115543de9441522/68747470733a2f2f646576656c6f7065722e737461636b626c69747a2e636f6d2f696d672f6f70656e5f696e5f737461636b626c69747a2e737667">
</a>

- Demo: [Harlan's Hamburgers](https://harlans-hamburgers.netlify.app/)

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

### 1. Add Module

Add the module to your Nuxt config.

```ts nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    'nuxt-schema-org',
  ],
})
```

All composable utilities and components are automatically imported for you thanks to [Nuxt auto import](https://v3.nuxtjs.org/guide/concepts/auto-imports).
See [Disable Auto Imports](#optional-disable-auto-imports) if you'd like to opt-out.


### 2. Configure the module

To server-side render correctly and make appropriate Schema adjustments, the module requires the following:

- **canonicalHost** `string`

  The [canonical host](https://developers.google.com/search/docs/advanced/crawling/consolidate-duplicate-urls) of your site. You can conditionally swap this depending on the environment, but it's not needed, simply
putting the production host is enough.

```ts nuxt.config.ts
export default defineNuxtConfig({
  schemaOrg: {
    // set to your production domain  
    canonicalHost: 'https://example.com',
  },
})
```

Check the [global configuration](/guide/global-config.html) if you'd like to make further global configurations.

### 3. Configure Global Schema

To get all your pages up and running with Schema, you can make use [schema inheritance](/guide/how-it-works.html#schema-inheritance) and define
Schema in your [app.vue](https://v3.nuxtjs.org/guide/directory-structure/app) file.

This allows all pages to inherit these Schemas, without them having to explicitly define them.

#### a. Composition API 

```vue app.vue
<script lang="ts" setup>
useSchemaOrg([
   // https://vue-schema-org.netlify.app/guide/guides/identity.html
  // @todo select appropriate identity
  // https://vue-schema-org.netlify.app/schema/website.html
  defineWebSite({
    name: 'My Awesome Website',
  }),
  // https://vue-schema-org.netlify.app/schema/webpage.html
  defineWebPagePartial(),
])
</script>
```

#### b. Component API

```vue app.vue
<template>
  <!-- @todo choose an identity: https://vue-schema-org.netlify.app/guide/guides/identity.html -->
  <SchemaOrgWebSite name="My Awesome Website" />
  <SchemaOrgWebPage />
  <RouterView />
</template>
```

### 4. Optional: WebPage Configuration

With the global schema provided in your root component, every page will generate a [WebPage](/api/schema/webpage) entry. 

In most cases you won't need to explicitly call `defineWebPage` again as 
inferences will be made based on your pages meta.

See the Nuxt [meta-tags](https://v3.nuxtjs.org/migration/meta#meta-tags) documentation on the best way to do this.

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
  <summary>b. definePageMeta</summary>

- Supports all inferences
- Not ideal for dynamic routes

```vue
<script setup>
definePageMeta({
  title: 'Hello World',
  description: 'This is a description',
  dateModified: new Date(2020, 1, 3),
  datePublished: new Date(2020, 1, 1),
  image: '/images/logo.png',
});
</script>
```
</details>

<br>

<details>
  <summary>c. defineWebPage or SchemaOrgWebPage </summary>

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

```vue
<template>
  <SchemaOrgWebPage name="Hello World" />
</template>
```

</details>


## Next Steps

Your site is now serving basic Schema.org for all pages, congrats! 🎉

The next steps are:
1. Choose an [Identity](/guide/guides/identity)
2. Get an understanding of [How it works](/guide/how-it-works)
3. Then feel free to add some custom recipes:

- [Breadcrumbs](/guide/recipes/breadcrumbs)
- [FAQ Page](/guide/recipes/faq)
- [Site Search](/guide/recipes/faq)

## Other Guides

### Optional: Disable Auto Imports

If you'd like to disable auto-imports for whatever reason, you can use the config.

```ts nuxt.config.ts
export default defineNuxtConfig({
  schemaOrg: {
    /**
     * Whether composables will be automatically imported for you.
     */
    autoImportComposables: false,
    /**
     * Whether components will be automatically imported for you.
     */
    autoImportComponents: false,
  },
})
```
