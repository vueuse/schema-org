<script lang="ts" setup>
definePageMeta({
  title: 'The Classic',
  description: 'A bun, beef batty, pickles and some cheese.',
  layout: 'shop',
  image: 'https://emojiguide.org/images/emoji/n/3ep4zx1jztp0n.png',
})
//

useSchemaOrg([
  defineProduct({
    offers: [
      {
        price: 15.50,
        priceCurrency: 'AUD',
      },
    ],
    aggregateRating: {
      ratingValue: 4.5,
      reviewCount: 10,
    },
  }),
])
</script>
<template>
<div class="text-center">
  <div class="flex items-center justify-around">
    <h1 class="font-bold text-3xl mb-3">The Classic</h1>
    <div class="font-light mb-2">$15.50 AUD</div>
  </div>
  <div>4.5/5 ⭐ <span class="opacity-75">10 reviews</span></div>
  <img src="https://emojiguide.org/images/emoji/n/3ep4zx1jztp0n.png" alt="{{ post.title }}" class="mb-4 mx-auto">
  <div class="bg-green-50 p-5 text-left">
    <p class="mb-5">The classic combo: a bun, beef batty, pickles and some cheese.</p>
    <h2 class="font-bold text-2xl mb-3">Ingredients</h2>
    <ul class="mb-5">
      <li class="ml-5 mb-2">🍞 Bread</li>
      <li class="ml-5 mb-2">🥓 Bacon</li>
      <li class="ml-5 mb-2">🍅 Tomato</li>
      <li class="ml-5 mb-2">🥬 Lettuce</li>
      <li class="ml-5 mb-2">🧀 Cheese</li>
      <li class="ml-5 mb-2">🥒 Pickle</li>
      <li class="ml-5">🐄 Beef</li>
    </ul>
  </div>
  <div class="bg-green-50 p-5 text-left">
    <h2 class="font-bold text-2xl mb-3">Reviews</h2>
    <div>
      <SchemaOrgReview>
        <template #rating>
        <span>5</span>
        </template>
        <template #author>
        <span>Harlan Wilton</span>
        </template>
        <div>
          Best burger ever!
        </div>
      </SchemaOrgReview>
    </div>
  </div>
  <button class="bg-blue-200 px-2 py-1 shadow rounded">Buy now</button>
</div>
</template>
