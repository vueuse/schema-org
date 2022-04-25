<script lang="ts" setup>
import type { BreadcrumbItem } from '@vueuse/schema-org'

const route = useRoute()

const breadcrumbItems = computed(() => {
  const nav: BreadcrumbItem[] = [{ name: 'Home', item: '/' }, { name: 'Articles', item: '/blog' }]
  if (route.path.startsWith('/blog/') && route.meta.title)
    nav.push({ name: route.meta.title })
  return nav
})
</script>
<template>
<div>
  <NuxtLayout name="default">
    <div>
      <SchemaOrgBreadcrumb class="gap-5 flex mb-5" :items="breadcrumbItems">
        <template #item="{ name, item }">
        <NuxtLink v-if="item" :to="item" class="underline">
          {{ name }}
        </NuxtLink>
        <span v-else>
              {{ name }}
            </span>
        </template>
      </SchemaOrgBreadcrumb>
      <div class="bg-yellow-50">
        <div class="p-10">
          <slot />
        </div>
      </div>
    </div>
  </NuxtLayout>
</div>
</template>
