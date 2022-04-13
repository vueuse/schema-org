<script lang="ts" setup>
import { defineImage, defineOrganization, defineWebPage, defineWebSite, useSchemaOrg } from '@vueuse/schema-org'
import { SchemaOrgBreadcrumb } from '@vueuse/schema-org-components'

useSchemaOrg([
  defineOrganization({
    name: 'Nuxt.js',
    logo: {
      '@id': 'https://v3.nuxtjs.org/#logo',
    },
    sameAs: [
      'https://twitter.com/nuxt_js',
    ],
  }),
  defineImage({
    '@id': 'https://v3.nuxtjs.org/#logo',
    'url': 'https://www.example.com/image.jpg',
  }),
  defineWebPage(),
  defineWebSite({
    name: 'Nuxt Framework',
  }),
])
const nav = [{ name: 'Home', item: '/' }, { name: 'About', item: '/about' }, { name: 'Articles', item: '/blog' }]
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
        <SchemaOrgBreadcrumb class="gap-5 flex mb-5">
          <template #item="{ name, link, isActive }">
          <span v-if="isActive">
            {{ name }}
          </span>
          <NuxtLink v-else :to="link" class="underline">
            {{ name }}
          </NuxtLink>
          </template>
        </SchemaOrgBreadcrumb>
        <slot />
      </div>
      <SchemaOrgInspector class="max-h-600px overflow-y-auto w-1000px " />
    </div>
  </div>
</template>
