# Introduction

## Features

- 🔎 Following [Google's Rich Results](https://developers.google.com/search/docs/advanced/structured-data/search-gallery) and [Yoast](https://developer.yoast.com/features/schema/overview) best practices
- 🧙 Schema.org data automation for absolute minimal configuration
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

## Recommended Schema

This package aims to get you up and running as quickly as possible with Schema.org that make a different
for your sites search appropriate.

For this, it's recommended that you create some Schema.org entries for all public pages: `WebPage`, `WebSite` and an identity.

An identity can either be an `Organization` or a `Person`.
Most of the time an `Organization` will suite, unless your building a personal blog.

## Start Setup

- [Nuxt](/guide/setup/nuxt)
- [Vitesse](/guide/setup/vitesse)
- [VitePress](/guide/setup/vitepress)
- [VitePress](/guide/setup/vite)
- [Other Frameworks](#other-frameworks)

