<script setup>
import DefaultTheme from 'vitepress/theme'
import { definePerson, defineWebPage, defineWebSite, useSchemaOrg } from '@vueuse/schema-org'
import { SchemaOrgInspector } from '@vueuse/schema-org-components'

const { Layout } = DefaultTheme

useSchemaOrg([
  defineWebPage(),
  defineWebSite({
    name: '@vueuse/schema-org',
  }),
  definePerson({
    name: 'Harlan Wilton',
  }),
])
</script>

<template>
<SchemaOrgInspector/>
<Layout />
</template>
