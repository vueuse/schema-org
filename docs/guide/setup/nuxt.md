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

## Usage

1. Add the module to your Nuxt config.

```ts nuxt.config.ts

export default defineNuxtConfig({
  modules: [
    'nuxt-schema-org',
  ],
  schemaOrg: {
    // required for SSR, add your production domain here  
    canonicalHost: 'https://domain-example.com/',
  },
})
```

2. Configure the module

Add your sites  with your sites [canonical host](https://developers.google.com/search/docs/advanced/crawling/consolidate-duplicate-urls),
this is required for SSR.
Use your sites production domain for this.

```ts nuxt.config.ts

export default defineNuxtConfig({
  schemaOrg: {
    // 
    canonicalHost: 'https://domain-example.com/',
  },
})
```

3. Setup default Schema.org data

The quickest way to get things up is to use the [recommended schema](/guide/#recommended-schema) in your default layout file.

Note that automatic imports are provided, so you can omit any manual imports.

```vue layouts/default.vue
<script lang="ts" setup>
useSchemaOrg([
  defineOrganization({
    name: 'Harlan\'s Hamburgers',
    logo: 'https://emojiguide.org/images/emoji/n/3ep4zx1jztp0n.png',
    sameAs: [
      'https://twitter.com/harlan_zw',
    ],
  }),
  defineWebPage(),
  defineWebSite({
    name: 'Harlan\'s Hamburgers',
  }),
])
</script>
<template>
<div>
  <slot />
</div>
</template>
```

## Next Steps

Before digging further, it may be useful to understand [how this package works](/guide/how-it-works)

Otherwise, you can start 
