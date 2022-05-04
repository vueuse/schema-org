# Setting up Schema.org for eCommerce in Vue

<SchemaOrgArticle image="/og.png" />

<BreadcrumbList :value="[ { item: '/', name: 'Home' }, { item: '/guide/recipes/', name: 'Recipes' }, { name: 'eCommerce' }]" />

::: warning
🔨 Documentation in progress
:::

## Useful Links

- [defineArticle](/schema/article)
- [Product | Google Search Central](https://developers.google.com/search/docs/advanced/structured-data/product)
- [Product | Yoast](https://developer.yoast.com/features/schema/pieces/product)

## Define a Product

By using the `vueuse-search-org` package, you have access to the `defineProduct` function which will inject [Product](/schema/article) Schema whilst handling
relations for you.

When defining your product, you have two choices, either rely on the routes meta, or define the fields manually.

### Standard Configuration

```vue articles/my-article.vue
<script setup lang="ts">
useSchemaOrg([
  defineProduct({
    name: 'Schema.org Book',
    description: 'Discover how to use Schema.org'
    image: [
      'https://example.com/photos/16x9/photo.jpg'
    ],
    offer: {
      price: '$10.00',
      priceCurrency: 'USD',
      availability: 'InStock',
    },
  })
])
</script>
```
