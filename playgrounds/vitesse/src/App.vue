<script setup lang="ts">
import { defineOrganization, defineWebPage, defineWebSite, useSchemaOrg } from 'vueuse-schema-org'
// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
useHead({
  title: 'Vitesse',
  meta: [
    { name: 'description', content: 'Opinionated Vite Starter Template' },
  ],
})

useSchemaOrg([
  defineWebPage(),
  defineWebSite({
    name: 'Vitesse',
  }),
  defineOrganization({
    name: 'Vitesse',
    logo: '/logo.png',
  }),
])
</script>

<template>
  <RouterView />
</template>
