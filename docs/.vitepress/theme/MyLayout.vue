<script setup>
import DefaultTheme from 'vitepress/theme'
const { Layout } = DefaultTheme

useSchemaOrg([
  defineWebSite({
    // change me
    name: 'Vue Schema.org',
  }),
  definePerson({
    name: 'Harlan Wilton',
    sameAs: [
      'https://harlanzw.com',
      'https://twitter.com/harlan_zw',
      'https://github.com/harlan-zw',
    ],
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
