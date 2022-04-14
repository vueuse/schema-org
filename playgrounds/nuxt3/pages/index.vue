<script setup lang="ts">
definePageMeta({
  title: 'Harlan Hamburgers 🍔',
  description: 'My page description',
})
</script>
<template>
  <div>
    {{ $route.meta.description }}
  </div>
</template>
