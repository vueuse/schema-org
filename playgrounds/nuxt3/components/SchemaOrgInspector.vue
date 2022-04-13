<script lang="ts" setup>
import { useSchemaOrg } from '@vueuse/schema-org'

const { nodes } = useSchemaOrg()
</script>
<template>
  <div class="">
    <h2 class="mb-2 font-4xl font-bold">
      Schema.org Inspector
    </h2>
    <div v-for="(snippet, index) in nodes" :key="index" class="rounded shadow bg-white p-3 mb-4">
      <pre>{{ snippet }}</pre>
    </div>
  </div>
</template>
