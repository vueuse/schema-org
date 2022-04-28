<script setup>
import DefaultTheme from 'vitepress/theme'
const { Layout } = DefaultTheme

useSchemaOrg([
  defineWebSite({
    // change me
    name: 'Vue Schema.org',
  }),
  defineOrganization({
    // change me
    name: '@vueuse/schema.org',
  }),
  defineWebPagePartial(),
])
</script>

<template>
<Layout>
  <template #page-bottom>
  <div style="margin-top: 50px;">
    <SchemaOrgInspector />
  </div>
  </template>
</Layout>
</template>
