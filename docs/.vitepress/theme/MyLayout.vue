<script setup>
import DefaultTheme from 'vitepress/theme'
const { Layout } = DefaultTheme
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
<Layout>
  <template #page-bottom>
  <div style="margin-top: 50px;">
    <p class="italic">Preview of <a href="/guide/debugging.html#component-schemaorginspector">SchemaOrgInspector</a> displaying current Schema for the page.</p>
    <SchemaOrgInspector />
  </div>
  </template>
</Layout>
</template>
