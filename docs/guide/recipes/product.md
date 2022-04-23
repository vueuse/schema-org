# Setting up Schema.org for a Product in Vue



## Useful Links

- [Product | Google Search Central](https://developers.google.com/search/docs/advanced/structured-data/product)
- [Product | Yoast](https://developer.yoast.com/features/schema/pieces/product)

## Define a Product

Calling  `withSearchAction` on your `defineWebSite` function and provide the URL of the search results page. This should be
on your global Schema.

Make sure that you set place `{search_term_string}` somewhere in your URL. This represents a query a user would be searching for.

```vue layouts/default.vue 
<script setup lang="ts">
useSchemaOrg([
  defineWebSite({
    // ...
  })
    .withSearchAction('/search/{search_term_string}'),
    // query param example 
    // .withSearchAction('/search?q={search_term_string}'),
])
</script>
```

