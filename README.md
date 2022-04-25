<h1 align='center'>@vueuse/schema-org</h1>

<p align="center">
<a href="https://www.npmjs.com/package/@vueuse/schema-org" target="__blank"><img src="https://img.shields.io/npm/v/@vueuse/schema-org?color=2B90B6&label=" alt="NPM version"></a>
<a href="https://www.npmjs.com/package/@vueuse/schema-org" target="__blank"><img alt="NPM Downloads" src="https://img.shields.io/npm/dm/@vueuse/schema-org?color=349dbe&label="></a>
<a href="https://vue-schema-org.netlify.app/" target="__blank"><img src="https://img.shields.io/static/v1?label=&message=docs%20%26%20demos&color=45b8cd" alt="Docs & Demos"></a>
<br>
<a href="https://github.com/@vueuse/schema-org" target="__blank"><img alt="GitHub stars" src="https://img.shields.io/github/stars/@vueuse/schema-org?style=social"></a>
</p>

<p align="center">
Schema.org for Vue with support for typed and automated Rich Results
</p>

<p align="center">
<table>
<tbody>
<td align="center">
<img width="2000" height="0" /><br>
<i>Status:</i> <b>In Development - Technical Preview 🔨</b><br>
<sub>⚠️ May change package name shortly</sub><br>
<sub>Made possible by my <a href="https://github.com/sponsors/harlan-zw">Sponsor Program 💖</a><br> Follow me <a href="https://twitter.com/harlan_zw">@harlan_zw</a> 🐦</sub><br>
<img width="2000" height="0" />
</td>
</tbody>
</table>
</p>

## Features

- 😊 No Schema.org knowledge required, get up and running in minutes with minimal configuration
- ✨  15+ Typed definitions for best practice ([Google](https://developers.google.com/search/docs/advanced/structured-data/search-gallery), [Yoast](https://developer.yoast.com/features/schema/overview)) Rich Results _e.g. `defineProduct`, `defineArticle`, `defineLocalBusiness`, etc._
- 🧙 Automated Schema management: `@id`'s, URL resolving & more
- 🍞 Composable or Components _e.g. `SchemaOrgBreadcrumbs`, `SchemaOrgQuestion`, `SchemaOrgInspector`_
- 🤝 Integrations for [VitePress](https://vitepress.vue.com), [Nuxt](https://nuxtjs.org/), [Vitesse](https://nuxtjs.org/) and [Vite](https://vitejs.dev/) with auto-imports
- 🌳 SSR and tree-shaking enabled

## Background

Implementing Schema.org for websites is the easiest way to unlock Google Rich Results for your search appearance.
This improved visibility offered by Rich Results has been shown to [improve click-through rates](https://simplifiedsearch.net/case-study-the-impact-of-rich-results-on-impressions-clicks-and-organic-traffic/).

Devs are currently embedding Schema.org in ld+json script tags, and it works!

However, vanilla Schema.org is a complex, verbose and boilerplate heavy solution:
- Option paralysis in which Schema to implement and which fields to use
- Limited and confusing documentation on best practices
- Nested Schema adding unnecessary kB to page weight
- Schema.org `@id` and `url` references when manually configured are brittle

This package aims to solve all of these issues, following the best practices from SEO giant Yoast and Google's own documentation.

## Get Started

[Docs](https://vue-schema-org.netlify.app/guide/)

Framework guides:
- [Nuxt](https://vue-schema-org.netlify.app/guide/setup/nuxt.html)
- [Vitesse](https://vue-schema-org.netlify.app/guide/setup/vitesse.html)
- [VitePress](https://vue-schema-org.netlify.app/guide/setup/vitepress.html)
- [Others](https://vue-schema-org.netlify.app/guide/setup/other-frameworks.html)

### Sample

Transforms the below code into an embedded `<script type="application/ld+json">` with the JSON content following it.

```ts
useSchemaOrg([
  defineOrganization({
    name: 'Nuxt.js',
    logo: '/logo.png',
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
      "description": "Nuxt is a progressive framework for building modern web applications with Vue.js",
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
