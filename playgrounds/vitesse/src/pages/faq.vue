<script setup lang="ts">
import { defineWebPage } from 'vueuse-schema-org'
import { SchemaOrgInspector, SchemaOrgQuestion } from 'vueuse-schema-org-components'

useSchemaOrg([
  defineWebPage({
    '@type': 'FAQPage',
  }),
])
</script>

<template>
  <div>
    faq
    <SchemaOrgQuestion>
      <template #question>
      <div class="font-bold mb-3 text-xl">What is the question?</div>
      </template>
      <template #answer>
      Not sure
      </template>
    </SchemaOrgQuestion>
    <SchemaOrgQuestion>
      <template #question>
      <div class="font-bold mb-3 text-xl">What about another question?</div>
      </template>
      <template #answer>
      <p>Heck ye</p>
      </template>
    </SchemaOrgQuestion>
    <SchemaOrgInspector />
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
  title: FAQ
</route>
