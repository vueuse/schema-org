<script setup lang="ts">
definePageMeta({
  layout: 'shop',
  title: 'Shop',
  description: 'My page description',
})

const products = [
  { slug: '/shop/the-classic', title: 'The Classic', excerpt: 'A bun, beef batty, pickles and some cheese.', price: 15.50, image: 'https://emojiguide.org/images/emoji/n/3ep4zx1jztp0n.png' },
]

useSchemaOrg([
  defineWebPage({
    '@type': 'CollectionPage',
  }),
])
</script>
<template>
  <div class="grid grid-cols-2 gap-10">
    <div v-for="(post, id) in products" :key="id" class="mb-5 p-5 bg-green-200 flex items-center justify-center flex-col">
      <h2 class="text-3xl mb-3">
        <NuxtLink :to="post.slug">
          {{ post.title }}
        </NuxtLink>
      </h2>
      <img src="https://emojiguide.org/images/emoji/n/3ep4zx1jztp0n.png" alt="{{ post.title }}" class="mb-4">
      <p class="mb-3">
        {{ post.excerpt }}
      </p>
      <p class="font-light mb-3 text-2xl">${{ post.price }}</p>
      <NuxtLink :to="post.slug" class="text-blue-500">
        Read more
      </NuxtLink>
    </div>
  </div>
</template>
