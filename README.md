<h1 align='center'>@vueuse/schema-org</h1>

<p align="center">
<a href='https://github.com/vueuse/schema-org/actions/workflows/test.yml'>
<img src='https://github.com/vueuse/schema-org/actions/workflows/test.yml/badge.svg' >
</a>
<a href="https://www.npmjs.com/package/@vueuse/schema-org" target="__blank"><img src="https://img.shields.io/npm/v/@vueuse/schema-org?color=2B90B6&label=" alt="NPM version"></a>
<a href="https://www.npmjs.com/package/@vueuse/schema-org" target="__blank"><img alt="NPM Downloads" src="https://img.shields.io/npm/dm/@vueuse/schema-org?color=349dbe&label="></a>
<a href="https://unhead-schema-org.harlanzw.com/" target="__blank"><img src="https://img.shields.io/static/v1?label=&message=docs%20%26%20demos&color=45b8cd" alt="Docs & Demos"></a>
<br>
<a href="https://github.com/vueuse/schema-org" target="__blank"><img alt="GitHub stars" src="https://img.shields.io/github/stars/vueuse/schema-org?style=social"></a>
</p>

<p align="center">
The quickest and easiest way to build Schema.org graphs for Vue.
</p>

<p align="center">
<table>
<tbody>
<td align="center">
<img width="830" height="0" /><br>
<i>Status:</i> <b><a href="https://github.com/vueuse/schema-org/releases/tag/v2.0.0">🎉 v2 Released</a></b> <br>
<sup> Please report any issues 🐛</sup><br>
<sub>Made possible by my <a href="https://github.com/sponsors/harlan-zw">Sponsor Program 💖</a><br> Follow me <a href="https://twitter.com/harlan_zw">@harlan_zw</a> 🐦 • Join <a href="https://discord.gg/275MBUBvgP">Discord</a> for help</sub><br>
<img width="830" height="0" />
</td>
</tbody>
</table>
</p>

## Features

- ✨ Powered by [unhead-schema-org](https://github.com/harlan-zw/unhead-schema-org): 20+ Schemas, automated relations, date and URL resolving 
- 🤝 Integrations for [Nuxt v3](https://nuxtjs.org/), [Vitesse](https://nuxtjs.org/) and [Vite](https://vitejs.dev/) with auto-imports
- 🍞 Choose your preferred API: Composables, Components or both!
- 🇹 Fully typed for [Google](https://developers.google.com/search/docs/advanced/structured-data/search-gallery) and [Yoast](https://developer.yoast.com/features/schema/overview) best practices
- 🌳 **0 kB JS runtime** (by default), SSR, tree-shaking

## Background

Implementing Schema.org is the easiest way to opt-in to [Google Rich Results](https://developers.google.com/search/docs/advanced/structured-data/search-gallery).
The improved visibility of Rich Results has been shown
to [improve click-through rates](https://simplifiedsearch.net/case-study-the-impact-of-rich-results-on-impressions-clicks-and-organic-traffic/).

Existing solutions to add Schema.org ld+json script tags work. However, implementing and maintaining Schema has issues:
- `@id` relationships and URL references are brittle
- Option paralysis in which Schema to implement and how
- Limited and confusing documentation on best practices
- Nested Schema adding unnecessary kB to page weight

This package aims to solve all of these issues,
following the best practices from SEO giant Yoast and Google's own documentation.

## Get Started

[Docs](https://unhead-schema-org.harlanzw.com/guide/)

Framework guides:
- [Nuxt](https://unhead-schema-org.harlanzw.com/integrations/nuxt/module)
- [Vitesse](https://unhead-schema-org.harlanzw.com/integrations/vue/vitesse)
- [Vite](https://unhead-schema-org.harlanzw.com/integrations/vue/vite)

### Example

Transforms the below code into an embedded `<script type="application/ld+json">` with the JSON content following it.

#### a. Composition API
```ts
useSchemaOrg([
  defineOrganization({
    name: 'Nuxt.js',
    logo: '/logo.png',
    sameAs: [
      'https://twitter.com/nuxt_js'
    ]
  }),
  defineWebSite({
    name: 'Nuxt',
  }),
  defineWebPage(),
])
```

#### b. Component API

```vue
<template>
<SchemaOrgOrganization 
  name="Nuxt.js" 
  logo="/logo.png"
  same-as="['https://twitter.com/nuxt_js']"
/>
<SchemaOrgWebSite name="Nuxt" />
<SchemaOrgWebPage/>
</template>
```

#### Output

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
        "@type": "ImageObject",
        "inLanguage": "en",
        "@id": "https://nuxtjs.org/#logo",
        "url": "https://nuxtjs.org/logo.png",
        "caption": "Nuxt.js",
        "contentUrl": "https://nuxtjs.org/logo.png"
      },
      "sameAs": [
        "https://twitter.com/nuxt_js"
      ],
      "image": {
        "@id": "https://nuxtjs.org/#logo"
      }
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
      "@id": "https://nuxtjs.org/#website",
      "url": "https://nuxtjs.org/",
      "inLanguage": "en",
      "name": "Nuxt",
      "publisher": {
        "@id": "https://nuxtjs.org/#identity"
      }
    }
  ]
}
```


## Sponsors

<p align="center">
  <a href="https://raw.githubusercontent.com/harlan-zw/static/main/sponsors.svg">
    <img src='https://raw.githubusercontent.com/harlan-zw/static/main/sponsors.svg'/>
  </a>
</p>


## License

MIT License © 2022-PRESENT [Harlan Wilton](https://github.com/harlan-zw)
