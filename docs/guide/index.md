# Introduction

## Features

- 🧙 Schema.org data automation for absolute minimal configuration
- 🔎 Adheres to [Google's Rich Results](https://developers.google.com/search/docs/advanced/structured-data/search-gallery) and [Yoast](https://developer.yoast.com/features/schema/overview) best practices
- ✨ 15+ typed definitions ready to go _e.g. `defineProduct`, `defineArticle`, `defineLocalBusiness`, etc._
- 🍞 Headless Components _e.g. `SchemaOrgBreadcrumbs`, `SchemaOrgQuestion`, `SchemaOrgInspector`_
- 🤝 Integrations for [VitePress](https://vitepress.vue.com), [Nuxt](https://nuxtjs.org/), [Vitesse](https://nuxtjs.org/) and [Vite](https://vitejs.dev/) with auto-imports
- 🤖 SSR enabled

## Background

Implementing Schema.org for websites is the easiest way to unlock Google Rich Results for your search appearance.

Devs are currently embedding Schema.org in ld+json script tags, and it works!

However, vanilla Schema.org is a complex, verbose and boilerplate heavy solution:
- Option paralysis in which Schema to implement and which fields to use
- Limited and confusing documentation on best practices
- Nested Schema adding unnecessary kB to page weight
- Schema.org `@id` and `url` references when manually configured are brittle

This package aims to solve all of these issues, following the best practices from SEO giant Yoast and Google's own documentation.

## Setup

- [Nuxt](/guide/setup/nuxt)
- [Vitesse](/guide/setup/vitesse)
- [VitePress](/guide/setup/vitepress)
- [Other Frameworks](/guide/setup/other-frameworks)

