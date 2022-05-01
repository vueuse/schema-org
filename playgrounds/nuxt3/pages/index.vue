<script setup lang="ts">
definePageMeta({
  description: 'My page description',
})
useHead({
  title: 'Harlan Hamburgers 🍔',
})
</script>
<template>
  <div>
    <strong>{{ $route.meta.description }}</strong>
  </div>
</template>
