<script setup lang="ts">
import { SchemaOrgBreadcrumb } from '@vueuse/schema-org-components'

definePageMeta({
  title: 'My home page',
  description: 'My page description'
})
</script>
<template>
<div>
  <h1 class="text-7xl mb-20">My site</h1>
  <SchemaOrgBreadcrumb :items="[{ name: 'About', item: '/about' }, { name: 'Articles', item: '/blog' }]" class="flex gap-5">
    <template #item="{ name, item }">
    <NuxtLink :to="item" class="underline">{{ name }}</NuxtLink>
    </template>
  </SchemaOrgBreadcrumb>
</div>
</template>
