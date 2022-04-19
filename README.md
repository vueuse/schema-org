# UseSchemaOrg

<p align="center">
<a href="https://www.npmjs.com/package/@unlighthouse/core" target="__blank"><img src="https://img.shields.io/npm/v/@unlighthouse/core?color=2B90B6&label=" alt="NPM version"></a>
<a href="https://www.npmjs.com/package/@unlighthouse/core" target="__blank"><img alt="NPM Downloads" src="https://img.shields.io/npm/dm/@unlighthouse/core?color=349dbe&label="></a>
<a href="https://unlighthouse.dev/" target="__blank"><img src="https://img.shields.io/static/v1?label=&message=docs%20%26%20demos&color=45b8cd" alt="Docs & Demos"></a>
<br>
<a href="https://github.com/harlan-zw/unlighthouse" target="__blank"><img alt="GitHub stars" src="https://img.shields.io/github/stars/harlan-zw/unlighthouse?style=social"></a>
</p>

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

## Get Started

[Docs]()

Framework guides:
- [Nuxt]()
- [Vite]()
- [VitePress]()
- [Vitesse]()

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


## Sponsors

<p align="center">
  <a href="https://raw.githubusercontent.com/harlan-zw/static/main/sponsors.svg">
    <img src='https://raw.githubusercontent.com/harlan-zw/static/main/sponsors.svg'/>
  </a>
</p>


## License

MIT License © 2022-PRESENT [Harlan Wilton](https://github.com/harlan-zw)
