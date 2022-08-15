<script setup lang="ts">
definePageMeta({
  title: 'FAQ page',
  description: 'this is the faq page',
})
</script>
<template>
<div>
  <SchemaOrgWebPage type="FAQPage" />
  <SchemaOrgQuestion class="mb-5">
    <template #question>
    What is the question?
    </template>
    <template #answer>
    Not sure
    </template>
    <div>
      <div class="font-bold mb-3 text-xl">What is the question?</div>
      <div>Not sure</div>
    </div>
  </SchemaOrgQuestion>
  <SchemaOrgQuestion>
    <template #question>
    What about another question?
    </template>
    <template #answer>
    Heck ye
    </template>
    <div>
      <div class="font-bold mb-3 text-xl">What about another question?</div>
      <div>Heck ye</div>
    </div>
  </SchemaOrgQuestion>
</div>
</template>
