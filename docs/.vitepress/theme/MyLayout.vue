<script setup>
import DefaultTheme from 'vitepress/theme'
import { useRoute } from 'vitepress'

const { Layout } = DefaultTheme
const route = useRoute()
</script>

<template>
<SchemaOrgPerson
  name="Harlan Wilton"
  image="/me.png"
  :same-as="[
        'https://github.com/harlan-zw',
        'https://twitter.com/harlan_zw',
        'https://harlanzw.com',
    ]"
/>
<SchemaOrgWebSite>
  <template #name>
  Vue Schema.org
  </template>
</SchemaOrgWebSite>
<SchemaOrgWebPage />
<div :class="[route.data.frontmatter.home ? 'home' : '']">
<Layout>
  <template #doc-after>
  <div style="margin-top: 50px;">
    <p class="italic">Preview of <a href="/guide/debugging.html#component-schemaorginspector">SchemaOrgInspector</a> displaying current Schema for the page.</p>
    <SchemaOrgInspector style="max-width: 100%;" />
  </div>
  </template>
</Layout>
</div>
</template>
