<script setup lang="ts">
definePageMeta({
  layout: 'blog',
  title: 'Blog pages',
  description: 'My page description',
})

const blogPosts = [
  { slug: '/blog/hello-world', title: 'Hello World', excerpt: 'This is a test page' },
  { slug: '/blog/hello-world', title: 'Hello World', excerpt: 'This is a test page' },
  { slug: '/blog/hello-world', title: 'Hello World', excerpt: 'This is a test page' },
]

useSchemaOrg([
  defineWebPage({
    '@type': 'CollectionPage',
  }),
])
</script>
<template>
  <div>
    <div v-for="(post, id) in blogPosts" :key="id" class="mb-5 p-5 bg-yellow-200">
      <h2 class="text-3xl mb-3">
        <NuxtLink :to="post.slug">
          {{ post.title }}
        </NuxtLink>
      </h2>
      <p class="mb-3">
        {{ post.excerpt }}
      </p>
      <NuxtLink :to="post.slug" class="text-blue-500">
        Read more
      </NuxtLink>
    </div>
  </div>
</template>
