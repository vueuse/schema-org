<script setup lang="ts">
useHead({
  titleTemplate: '%s - Harlan\'s Hamburgers',
  title: 'Search Hamburgers 🍔',
})
useSchemaOrg([
  defineWebPage({
    '@type': ['CollectionPage', 'SearchResultsPage'],
  }),
])
</script>
<template>
 <div>Search</div>
</template>
