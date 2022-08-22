<script lang="ts" setup>
useHead({
  title: 'Title Override',
  meta: [
    {
      name: 'description',
      content: 'Description override',
    },
    {
      property: 'og:image',
      content: 'https://example-image-override.com/img.png',
    },
  ],
})
</script>

<template>
  <div>
    <h1>Meta Overrides</h1>
  </div>
</template>
