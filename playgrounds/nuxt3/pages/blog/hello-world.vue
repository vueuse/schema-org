<script lang="ts" setup>
definePageMeta({
  title: 'Hello World',
  description: 'This is a blog post',
  layout: 'blog',
  image: 'https://example.com/blog/hello-world.png',
})
//
useSchemaOrg([
  defineArticle({
    datePublished: '2020-01-01',
    dateModified: '2020-01-01',
    wordCount: 1200,
    thumbnailUrl: 'https://via.placeholder.com/1200x600',
    keywords: [
      'blog',
      'nuxt',
      'vue',
      'vuex',
      'vue-router',
      'vue-use',
      'vue-use-schema-org',
    ],
  }),
])

</script>
<template>
  <div>
    <h1>Hello World</h1>
    <img src="https://via.placeholder.com/1200x600" alt="Hello World" class="mx-auto">
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium dolorum ea, esse neque perspiciatis quibusdam reiciendis unde voluptatum! Atque eaque facere ipsam maiores neque nesciunt, numquam quas sequi soluta voluptatibus?</p>
  </div>
</template>
