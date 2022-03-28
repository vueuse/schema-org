<script setup lang="ts">
const title = useMetaTitle()
const description = useMetaDescription()
const image = useMetaImage()
// // disable indexing
// usePageIndexable(false)

useTitleTemplate('%s - Site')

useMetaSharable({
  title: 'Home',
  description: 'Welcome to my home page where I show you some of my projects.',
  image: 'https://images.unsplash.com/photo-1604689910903-68729001a0d4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
  // opt out of twitter
  og: {
    title: 'See what\'s happening on my home page'
  },
  twitter: {
    title: 'See what\'s happening on my home page',
  }
})
</script>

<template>
<div>
  <label> Title:
    <input type="text" v-model="title" />
  </label>
  <br>
  <label> Description:
    <textarea v-model="description"></textarea>
  </label>
  <br>
  <img :src="image?.trim()" width="300" height="200" />
</div>
<nuxt-link to="/blog/hello">blog</nuxt-link>
</template>
