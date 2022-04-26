<script setup lang="ts">
definePageMeta({
  title: 'Search Hamburgers 🍔',
})

useSchemaOrg([
  defineWebPagePartial({
    '@type': ['CollectionPage', 'SearchResultsPage'],
  }),
])
</script>
<template>
 <div>Search</div>
</template>
