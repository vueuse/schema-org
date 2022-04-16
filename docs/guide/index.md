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
