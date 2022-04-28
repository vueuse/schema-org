<script setup>
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

Note: it has not been tested on Nuxt bridge or Nuxt v2 just yet.

<a href="https://stackblitz.com/edit/nuxt-starter-g6cuwb?file=layouts/default.vue" target="_blank">
  <img alt="Open in StackBlitz" src="https://camo.githubusercontent.com/bf5c9492905b6d3b558552de2c848c7cce2e0a0f0ff922967115543de9441522/68747470733a2f2f646576656c6f7065722e737461636b626c69747a2e636f6d2f696d672f6f70656e5f696e5f737461636b626c69747a2e737667">
</a>


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

### 2. Configure the module

To make the appropriate automation for you, the module requires you to provide the following global configuration:

- **canonicalHost** `string`

  The [canonical host](https://developers.google.com/search/docs/advanced/crawling/consolidate-duplicate-urls)[canonical host](https://developers.google.com/search/docs/advanced/crawling/consolidate-duplicate-urls) of your site. You can conditionally swap this depending on the environment, but it's not needed, simply
putting the production host is enough.

```ts nuxt.config.ts
export default defineNuxtConfig({
  schemaOrg: {
    // set to your production domain  
    canonicalHost: 'https://nuxtjs.org',
  },
})
```

Check the [global configuration](/guide/how-it-works#global-config) if you'd like to make further global configurations.

### 3. Configure Global Schema

The quickest way to get things up is to use the recommended [global schema](/guide/how-it-works.html#recommended-schema) in your default layout file.

This allows all pages using the default layout to inherit Schema, without having to define it on every page.

#### Example 

See the below example. Note that by default, all composable utilities and components are automatically imported for you.

Make sure you update the Nuxt dummy data when copy+pasting.

```vue layouts/default.vue
<script lang="ts" setup>
useSchemaOrg([
   // @todo choose appropriate identity
   // https://vue-schema-org.netlify.app/guide/guides/identity.html
   defineOrganization({
    name: 'Nuxt',
    logo: 'https://emojiguide.org/images/emoji/n/3ep4zx1jztp0n.png',
    sameAs: ['https://twitter.com/harlan_zw'],
  }),
  // https://vue-schema-org.netlify.app/schema/website.html
  defineWebSite({
    name: 'Nuxt',
  }),
  // https://vue-schema-org.netlify.app/schema/webpage.html
  defineWebPagePartial(),
])
</script>
```

### 4. Providing WebPage Data

With the global schema provided in your layout files, you should now make add any extra metadata to your pages.

At a minimum, you should have a page title for every page.

The package can infer the title from the route meta or the `document.title`. Alternatively, you can call the define
function to provide the data.

#### a. Use `useHead`

- Only `title` and `description` will be passed

```vue
<script setup>
useHead({
  title: 'Hello World',
  meta: [
    {
      name: `description`,
      content: 'This is a description',
    },
  ],
});
</script>
```

#### b. Use `definePageMeta`

- Can provide all meta data
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

#### c. Use `defineWebPagePartial`

```vue
<script setup>
useSchemaOrg(
  defineWebPagePartial({
    // you can omit `title` and `description` if you've set them up in `useHead`
    dateModified: new Date(2020, 1, 3),
    datePublished: new Date(2020, 1, 1),
    image: '/images/logo.png',
  })
)
</script>
```

## Next Steps

Your site is now serving basic Schema.org for all pages using the default layout, congrats! 🎉

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

### Current Page Example

```ts
useSchemaOrg(
  defineHowTo({
    name: 'Install Schema.org on Nuxt.js',
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
```

<SchemaOrgInspector />
