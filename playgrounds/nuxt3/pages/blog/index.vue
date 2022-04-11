<script setup lang="ts">

import { SchemaOrgBreadcrumb } from '@vueuse/schema-org-components'

definePageMeta({
  schema: {
    pageType: 'CollectionPage'
  },
  layout: 'blog',
  title: 'Blog pages',
  description: 'My page description'
})

const blogPosts = [
  { slug: '/blog/hello-world', title: 'Hello World', excerpt: 'This is a test page' },
  { slug: '/blog/hello-world', title: 'Hello World', excerpt: 'This is a test page' },
  { slug: '/blog/hello-world', title: 'Hello World', excerpt: 'This is a test page' },
]
</script>
<template>
<div>
  <h1 class="text-7xl mb-20">Blog</h1>
  <SchemaOrgBreadcrumb :items="[{ name: 'Home', item: '/' }, { name: 'Articles', item: '/blog' }]" class="flex gap-5">
    <template #item="{ name, item }">
    <NuxtLink :to="item" class="underline">{{ name }}</NuxtLink>
    </template>
  </SchemaOrgBreadcrumb>

  <div class="mt-10">
  <div v-for="(post, id) in blogPosts" :key="id" class="mb-5 p-5 bg-yellow-200">
    <h2 class="text-3xl mb-3">
      <NuxtLink :to="post.slug">{{ post.title }}</NuxtLink>
    </h2>
    <p class="mb-3">{{ post.excerpt }}</p>
    <NuxtLink :to="post.slug" class="text-blue-500">Read more</NuxtLink>
  </div>
  </div>
</div>
</template>
