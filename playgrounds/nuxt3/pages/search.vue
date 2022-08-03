<script setup lang="ts">
definePageMeta({
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
