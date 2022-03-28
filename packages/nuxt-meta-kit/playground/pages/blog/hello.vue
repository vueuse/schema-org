<script setup>
definePageMeta({
  layout: 'article',
})

useMetaSharable({
  title: 'Hello',
  og: {
    title: 'Article: hello'
  },
})
</script>
<template>
<h1>Hello</h1>

<nuxt-link to="/">home</nuxt-link>
</template>
