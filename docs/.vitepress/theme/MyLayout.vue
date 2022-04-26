<script setup>
import DefaultTheme from 'vitepress/theme'
const { Layout } = DefaultTheme

useSchemaOrg([
  defineWebSite({
    // change me
    name: 'VitePress',
  }),
  defineOrganization({
    // change me
    name: 'Vue.js',
  }),
  defineWebPagePartial(),
])
</script>

<template>
<Layout>
</Layout>
</template>
