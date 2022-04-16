<script lang="ts" setup>
import {
  defineOrganization, defineWebPage, defineWebSite,
  useSchemaOrg
} from 'vueuse-schema-org'
import { SchemaOrgInspector } from 'vueuse-schema-org-components'

useSchemaOrg([
  defineOrganization({
    name: 'Harlan\'s Hamburgers',
    logo: 'https://emojiguide.org/images/emoji/n/3ep4zx1jztp0n.png',
    sameAs: [
      'https://twitter.com/harlan_zw',
    ],
  }),
  defineWebPage(),
  defineWebSite({
    name: 'Harlan\'s Hamburgers',
  }),
])
const nav = [{ name: 'Home', item: '/' }, { name: 'About', item: '/about' }, { name: 'Articles', item: '/blog' }, { name: 'Shop', item: '/shop' }]
</script>
<template>
  <div class="bg-blue-50 h-screen flex pb-20 flex-col items-center justify-center">
    <div class="mb-20 gap-5 container mx-auto">
      <NuxtLink v-for="(link, key) in nav" :key="key" :to="link.item" class="underline mr-5">
        {{ link.name }}
      </NuxtLink>
    </div>
    <div class="container mx-auto flex items-center gap-20">
      <div class="w-full max-h-900px overflow-y-auto ">
<!--        <SchemaOrgBreadcrumb class="gap-5 flex mb-5">-->
<!--          <template #item="{ name, link, isActive }">-->
<!--            <span v-if="isActive">-->
<!--              {{ name }}-->
<!--            </span>-->
<!--            <NuxtLink v-else :to="link" class="underline">-->
<!--              {{ name }}-->
<!--            </NuxtLink>-->
<!--          </template>-->
<!--        </SchemaOrgBreadcrumb>-->
        <h1 class="text-7xl mb-20">
          {{ $route.meta.title }}
        </h1>
        <slot />
      </div>
      <SchemaOrgInspector class="max-h-600px overflow-y-auto w-1000px bg-white shadow p-5" />
    </div>
  </div>
</template>
