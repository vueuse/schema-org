<script lang="ts" setup>
useSchemaOrg([
  defineOrganization({
    name: 'Harlan\'s Hamburgers',
    logo: 'https://emojiguide.org/images/emoji/n/3ep4zx1jztp0n.png',
    sameAs: [
      'https://twitter.com/harlan_zw',
    ],
  }),
  defineWebPagePartial(),
  defineWebSite({
    name: 'Harlan\'s Hamburgers',
    potentialAction: [
      asSearchAction({
        target: '/search?q={search_term_string}',
      }),
    ],
  }),
  defineBreadcrumb({
    itemListElement: [
      {
        position: 1,
        name: 'Harlan\'s Hamburgers',
      },
    ],
  }),
])
const nav = [
  { name: 'Home', item: '/' },
  { name: 'About', item: '/about' },
  { name: 'Articles', item: '/blog' },
  { name: 'Shop', item: '/shop' },
  { name: 'FAQ', item: '/faq' },
]
</script>
<template>
<div class="bg-blue-50 h-screen flex pb-20 flex-col items-center justify-center">
  <div class="mb-20 gap-5 container mx-auto">
    <template v-for="(link, key) in nav" :key="key">
    <NuxtLink :to="link.item" class="underline mr-5">
      {{ link.name }}
    </NuxtLink>
    </template>
    <input type="search" class="px-3 py-1 ml-full text-lg shadow border-2 border-grey-300 rounded-lg">
  </div>
  <div class="container mx-auto flex items-center gap-20">
    <div class="w-full max-h-900px overflow-y-auto ">
      <h1 class="text-7xl mb-20">
        {{ $route.meta.title }}
      </h1>
      <slot />
    </div>
    <SchemaOrgInspector />
  </div>
</div>
</template>
