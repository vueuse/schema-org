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

- 🧙 Schema.org data automation for absolute minimal configuration
- 🔎 Following [Google's Rich Results](https://developers.google.com/search/docs/advanced/structured-data/search-gallery) and [Yoast](https://developer.yoast.com/features/schema/overview) best practices 
- ✨ Heaps of out-of-the-box definitions: `defineProduct`, `defineArticle`, `defineLocalBusiness`, etc.
- 🍞 Headless Components: `SchemaOrgBreadcrumbs`, `SchemaOrgPrimaryImage`, (more coming soon)
- 🤝 Integrated with [vue-router](https://router.vuejs.org/) and [@vueuse/head](https://github.com/vueuse/head)
- 🇹 Fully typed

## Background

Implementing Schema.org for websites is the easiest way to unlock Google Rich Results for your search appearance.

Devs are currently embedding Schema.org in ld+json script tags, and it works!

However, vanilla Schema.org is a complex, verbose and boilerplate heavy solution:
- Option paralysis in which Schema to implement and which fields to use
- Limited and confusing documentation on best practices
- Nested Schema adding unnecessary kB to page weight
- Schema.org `@id` and `url` references when manually configured are brittle

This package aims to solve all of these issues, following the best practices from SEO giant Yoast and Google's own documentation.

### Basic Sample

```ts
useSchemaOrg([
  defineOrganization({
    name: 'Nuxt.js',
    logo: 'https://nuxtjs.org/logo.png',
    sameAs: [
      'https://twitter.com/nuxt_js'
    ]
  }),
  defineWebPage(),
  defineWebSite({
    name: 'Nuxt',
    description: 'Nuxt is a progressive framework for building modern web applications with Vue.js',
  })
])
```

Outputs the following JSON:

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://nuxtjs.org/#identity",
      "url": "https://nuxtjs.org/",
      "name": "Nuxt.js",
      "logo": {
        "@id": "https://nuxtjs.org/#logo"
      },
      "sameAs": [
        "https://twitter.com/nuxt_js"
      ]
    },
    {
      "@type": "WebPage",
      "@id": "https://nuxtjs.org/#webpage",
      "url": "https://nuxtjs.org/",
      "potentialAction": [
        {
          "@type": "ReadAction",
          "target": [
            "https://nuxtjs.org/"
          ]
        }
      ],
      "about": {
        "@id": "https://nuxtjs.org/#identity"
      },
      "primaryImageOfPage": {
        "@id": "https://nuxtjs.org/#logo"
      },
      "isPartOf": {
        "@id": "https://nuxtjs.org/#website"
      }
    },
    {
      "@type": "WebSite",
      "@id": "hhttps://nuxtjs.org/#website",
      "url": "hhttps://nuxtjs.org/",
      "name": "Nuxt",
      "description": "Nuxt is a progressive framework for building modern web applications with Vue.js",
      "publisher": {
        "@id": "https://nuxtjs.org/#identity"
      }
    },
    {
      "@type": "ImageObject",
      "inLanguage": "en-AU",
      "@id": "https://nuxtjs.org/#logo",
      "url": "https://nuxtjs.org/logo.png",
      "caption": "Nuxt.js",
      "contentUrl": "https://nuxtjs.org/logo.png"
    }
  ]
}
```

### Install

Using Nuxt? Check out [nuxt-schema-org]()

```bash
# NPM
npm install -D vueuse-schema-org
# or Yarn
yarn add -D vueuse-schema-org
# or PNPM
pnpm add -D vueuse-schema-org
```

# Usage

Register the Vue plugin:

```ts
import { createApp } from 'vue'
import { createSchemaOrg } from 'vueuse-schema-org'

const app = createApp()
const schemaOrg = createSchemaOrg({
  // providing a host is required for SSR
  canoicalHost: 'https://example.com',
})

app.use(schemaOrg)

app.mount('#app')
```

## Quick Setup

If you're not familiar with Schema.org, then the quickest way to get started is with the `defineBasicPreset`.

The preset will generate the Schema.org that is required for all pages: `WebPage` and `WebSite`. 
It assumes your identity as an `Organization`. If you're creating a blog for yourself, see the guide below.

It's recommended you put this code in your `App.vue` or a default layout file.

```vue
<script setup lang="ts">
import { useSchemaOrg, defineBasicPreset } from "vueuse-schema-org";

useSchemaOrg([
  defineBasicPreset({
    // your sites / brand name
    name: 'My App',
    logo: 'https://example.com/logo.png',
    // optional field, put all of your socials here
    sameAs: [
      'https://twitter.com/my-twitter-handle'
    ]
  })
])
</script>
```

## Explicit Global setup

If you'd like finer control over the global Schema.org created, then you can define the nodes yourself.

You will need to define a `WebPage` and a `WebSite` as well as an identity. An identity can be either a `Person` or an `Organization`.

### Organisation Example

If your brand isn't directly related to a single person, then you'll want to setup your site as an organization.

```vue
<script setup lang="ts">
import { useSchemaOrg, defineOrganization } from "vueuse-schema-org";

useSchemaOrg([
  defineOrganization({
    name: 'Nuxt.js',
    logo: 'https://vueuse.js.org/logo.png',
    sameAs: [
      'https://twitter.com/nuxt_js'
    ]
  }),
  
])
</script>
```

### Person Example

If you're creating a site about a person, such as a blog, then you'll want to use the `Person` schema.

```vue
<script setup lang="ts">
import { definePerson, useSchemaOrg } from "vueuse-schema-org";

useSchemaOrg([
  definePerson({
    name: 'Harlan Wilton',
    image: 'https://pbs.twimg.com/profile_images/1296047415611387904/bI-fltZ4_normal.jpg',
  })
])
</script>
```

## Page Schema.org Setup

Once you have setup your global Schema.org, it's now time to fine-tune what each page is serving.

To start with you can start specifying the types of your pages, then move on to Schema.org which will 
benefit you in Google results.

### Basic: Page Type

Say you're working on a site with an about page. It's useful to specify the type as follows.

```vue
<script setup lang="ts">
import { useSchemaOrg, defineWebPage } from "vueuse-schema-org";

useSchemaOrg([
  // Because the @id isn't specified, this will merge with our global WebPage
  defineWebPage({
    '@type': 'AboutPage'
  })
])
</script>
```

### Advanced: Article

Using the power of this package, we can define an article and have the Schema.org graph node link up everything
correctly to have the article as the main entity of the page.

The package comes with an integration with vue-router's meta feature. Providing meta as `title` and `description` will allow
Schema.org to be inferred.

```vue

<script setup lang="ts">
import {useSchemaOrg, defineArticle} from "vueuse-schema-org";

// nuxt
definePageMeta({
  title: 'My Article',
  description: 'This is an article about my life'
})

useSchemaOrg([
  defineArticle({
    datePublished: '2020-01-01',
    dateModified: '2020-01-01',
  })
])
</script>
```

Output:

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "dateModified": "2020-01-01",
  "datePublished": "2020-01-01",
  "headline": "My Article",
  "description": "This is an article about my life",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://vueuse.js.org/",
    "name": "vueuse.js.org"
  }
}
```

## Features

### Breadcrumbs 🍞

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

MIT License © 2022 [Harlan Wilton](https://github.com/harlan-zw)
