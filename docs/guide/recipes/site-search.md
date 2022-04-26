# Setting up Schema.org for Site Search in Vue

If your site offers a search function, you may like to define markup to help Google understand it.


## Useful Links

- [Sitelinks Searchbox](https://developers.google.com/search/docs/advanced/structured-data/sitelinks-searchbox)
- [SearchAction | Yoast](https://developer.yoast.com/features/schema/pieces/searchaction)

## Define a Search Action

Calling  `withSearchAction` on your `defineWebSite` function and provide the URL of the search results page. This should be
on your global Schema.

Make sure that you set place `{search_term_string}` somewhere in your URL. This represents a query a user would be searching for.

```vue layouts/default.vue 
<script setup lang="ts">
useSchemaOrg([
  defineWebSite({
    // ...
    potentialActions: [
     defineSearchAction({
       target: 'https://example.com/search?q={search_term_string}'
     })
    ]
  })
])
</script>
```

## Define your Search Results Page

Using your [WebPage](/schema/webpage) Schema you can define the page as a search results page.

```vue pages/search.vue
<script setup lang="ts">
useSchemaOrg([
  defineWebPagePartial({
    '@type': ['CollectionPage', 'SearchResultsPage'],
  })
])
</script>
```
