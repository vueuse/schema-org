# Setting up Schema.org in Other Frameworks

## Install

```bash
# NPM
npm install -D vueuse-schema-org
# or Yarn
yarn add -D vueuse-schema-org
# or PNPM
pnpm add -D vueuse-schema-org
```

### Dependencies

This package depends on `useHead` being available from `@vueuse/head`.
You'll need to install this package if you haven't already got it.

```bash
# NPM
npm install -D @vueuse/head
# or Yarn
yarn add -D @vueuse/head
# or PNPM
pnpm add -D @vueuse/head
```

This package relies on a router implementation; the easiest way is to make sure you're using `vue-router`.

If you're not using `vue-router`, it's possible to mock the current route by providing a way to resolve the current URL 
through the `useRoute` method from the constructor.

## Usage

Modify your `.vitepress/theme/index.ts` file to add the plugin.

```ts
import DefaultTheme from 'vitepress/theme'
import { createSchemaOrg } from 'vueuse-schema-org'
import { createHead, useHead } from '@vueuse/head'
import { useRoute } from 'vitepress'
import MyLayout from './MyLayout.vue'

export default {
  ...DefaultTheme,
  Layout: MyLayout,
  enhanceApp({ app }) {
    const head = createHead()
    const schemaOrg = createSchemaOrg({
      // providing a host is required for SSR
      canonicalHost: 'https://schema-org.vueuse.com',
      useHead,
      useRoute,
    })
    app.use(head)
    app.use(schemaOrg)
  },
}
```

## Next Steps

# Using Route Meta

By providing a `useRoute` function to `createSchemaOrg`, the package can hook into
the page meta, minimising configuration when the meta is defined.

Most sites use `vue-router`, so you can pass the [useRoute](https://router.vuejs.org/api/#useroute) function in.
Assuming you have setup the package correctly, by providing meta you can make the most of the configuration automation.

