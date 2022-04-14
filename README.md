# UseSchemaOrg 

<p align="center">
Simple and automated Schema.org generation for Google rich results in your sites search appearance.
</p>


<p align="center">
<table>
<tbody>
<td align="center">
<img width="2000" height="0" /><br>
<i>Status:</i> <b>In Development 🔨</b><br>
<sub>Made possible by my <a href="https://github.com/sponsors/harlan-zw">Sponsor Program 💖</a><br> Follow me <a href="https://twitter.com/harlan_zw">@harlan_zw</a> 🐦</sub><br>
<img width="2000" height="0" />
</td>
</tbody>
</table>
</p>

## Features

- 🔎 Best practice Schema.org Graph with automated @id linking and [Rich Results](https://developers.google.com/search/docs/advanced/structured-data/search-gallery)
- ✨ Define utils: Article, Carousel,  FAQ, Reviews, + more to come
- 🍞 Breadcrumb component: zero-config markup and Schema.org generation
- 🤝 Integrated with [vue-router](https://router.vuejs.org/) and [@vueuse/head](https://github.com/vueuse/head)
- 🇹 Fully typed Schema.org definitions based on [Google's recommendations](https://developers.google.com/search/docs/advanced/structured-data/a)


### Install

```bash
# NPM
npm install -D @vueuse/schema-org
# or Yarn
yarn add -D @vueuse/schema-org
# or PNPM
pnpm add -D @vueuse/schema-org
```

# Usage

Within your `nuxt.config.ts` add the following.

```ts
export default defineNuxtConfig({
  buildModules: [
    'nuxt-schema-org'
  ],
})
```

Configure the default app fields for your site.


### Organisation

If you're creating a website for a brand, then you'll want to setup the organisation meta.

```ts
export default defineNuxtConfig({
  // ...
  schemaOrg: {
    host: 'https://v3.nuxtjs.org/',
    // use an organisation as the publisher
    publisher: defineOrganization({
      name: 'Nuxt.js',
      logo: {
        url: 'https://vueuse.js.org/logo.png',
        width: '200',
        height: '200'
      },
      sameAs: [
        'https://twitter.com/nuxt_js'
      ]
    }),
  }
})
```

### Person

If you're creating a site about a person, such as a blog, then you'll want to use the `person` schema.


```ts
export default defineNuxtConfig({
  // ...
  schemaOrg: {
    host: 'https://v3.nuxtjs.org/',
    // Alternative: use a person
    publisher: definePerson({
      name: 'Harlan Wilton',
      image: 'https://pbs.twimg.com/profile_images/1296047415611387904/bI-fltZ4_normal.jpg',
    })
  }
})
```


#### Extending Schema

// @todo

### Composables

### API

- `useSchemaOrgPageType(type: SupportedSchemaOrgPageType, options)`
 
  Set page type

- `useSchemaOrgArticleType(type: SupportedSchemaOrgArticleType, options)`
  
  Mark the page as displaying an article and set the type


```vue
<script setup lang="ts">
// mark the page as an about page
useSchemaOrgPageType('AboutPage')
</script>
```

```vue
<script setup lang="ts">
// mark the page as an about page
useSchemaOrgArticleType('TechArticle')
</script>
```

## Breadcrumbs 🍞

You can either use the `useSchemaOrgBreadcrumbs` or the `SchamaOrgBreadcrumbs` component.

### Composable

```vue
<script setup lang="ts">
const breadcrumbs = [
  {
    name: 'Home',
    url: '/'
  },
  {
    name: 'About',
    url: '/about'
  }
]

useSchemaOrgBreadcrumbs(breadcrumbs)
</script>
```

### Headless UI component

```vue
<template>
<SchamaOrgBreadcrumbs :items="items">
  <template #link="{ text, link }">>
    <nuxt-link :to="link">text</nuxt-link>
  </template>
</SchamaOrgBreadcrumbs>
</template>
```


## Sponsors

<p align="center">
  <a href="https://raw.githubusercontent.com/harlan-zw/static/main/sponsors.svg">
    <img src='https://raw.githubusercontent.com/harlan-zw/static/main/sponsors.svg'/>
  </a>
</p>


## License

MIT License © 2022 [Harlan Wilton](https://github.com/harlan-zw)__
