<script setup>
import DefaultTheme from 'vitepress/theme'
const { Layout } = DefaultTheme

useSchemaOrg([
  defineWebPage(),
  defineWebSite({
    // change me
    name: 'VitePress',
  }),
  defineOrganization({
    // change me
    name: 'Vue.js',
  }),
])
</script>

<template>
<Layout>
</Layout>
</template>
