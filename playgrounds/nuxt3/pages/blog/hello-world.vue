<script lang="ts" setup>
import { useSchemaOrgArticle } from '@vueuse/schema-org'
import { SchemaOrgBreadcrumb } from '@vueuse/schema-org-components'

definePageMeta({
  title: 'Hello World',
  description: 'This is a blog post',
  layout: 'blog',
  image: 'https://example.com/blog/hello-world.png',
})

useSchemaOrgArticle({
  datePublished: '2020-01-01',
  dateModified: '2020-01-01',
  wordCount: 1200
})
</script>
<template>
<div>
  <SchemaOrgBreadcrumb :items="[{ name: 'Home', item: '/' }, { name: 'Articles', item: '/blog' }, { name: 'Hello World' }]" class="flex gap-5">
    <template #item="{ name, item }">
    <NuxtLink v-if="item" :to="item" class="underline">{{ name }}</NuxtLink>
    <span v-else>{{ name }}</span>
    </template>
  </SchemaOrgBreadcrumb>
  <h1>Hello World</h1>
  <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium dolorum ea, esse neque perspiciatis quibusdam reiciendis unde voluptatum! Atque eaque facere ipsam maiores neque nesciunt, numquam quas sequi soluta voluptatibus?</p>
</div>
</template>
