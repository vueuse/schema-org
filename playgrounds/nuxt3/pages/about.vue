<script setup lang="ts">
import {
  useSchemaOrgWebPage,
} from '@vueuse/schema-org'
import { SchemaOrgBreadcrumb } from '@vueuse/schema-org-components'

definePageMeta({
  layout: 'default',
  title: 'About page',
  description: 'this is the about page'
})

const breadcrumbs = [
  {
    name: 'Home',
    link: '/'
  },
  {
    name: 'About',
    link: '/about'
  },
]

useSchemaOrgWebPage()
</script>
<template>
<div>
  <h1 class="text-7xl mb-20">{{ $route.meta.title  }}</h1>
  <SchemaOrgBreadcrumb :items="breadcrumbs" class="gap-5 flex">
    <template #item="{ name, link }">
    <NuxtLink :to="link" class="underline">{{ name }}</NuxtLink>
    </template>
  </SchemaOrgBreadcrumb>
</div>
</template>
