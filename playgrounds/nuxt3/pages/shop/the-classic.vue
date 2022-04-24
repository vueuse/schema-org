<script lang="ts" setup>
definePageMeta({
  title: 'The Classic',
  description: 'A bun, beef batty, pickles and some cheese.',
  layout: 'shop',
  image: 'https://emojiguide.org/images/emoji/n/3ep4zx1jztp0n.png',
})
//
useSchemaOrg([
  defineProduct({})
    .withOffer({
      price: 15.50,
      priceCurrency: 'AUD',
    }),
])
</script>
<template>
  <div>
    <img src="https://emojiguide.org/images/emoji/n/3ep4zx1jztp0n.png" alt="{{ post.title }}" class="mb-4">
    <p class="mb-2">A bun, beef batty, pickles and some cheese.</p>
    <button class="bg-blue-200 px-2 py-1 shadow rounded">Buy now</button>
  </div>
</template>
