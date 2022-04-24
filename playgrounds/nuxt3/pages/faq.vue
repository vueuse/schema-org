<script setup lang="ts">
definePageMeta({
  title: 'FAQ page',
  description: 'this is the faq page',
})

useSchemaOrg([
  defineWebPage({
    '@type': 'FAQPage',
  }),
])
</script>
<template>
<div>
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
</div>
</template>
