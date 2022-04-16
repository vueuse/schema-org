<script lang="ts" setup>
import {defineArticle, defineOffer, defineProduct, useSchemaOrg} from 'vueuse-schema-org'

definePageMeta({
  title: 'Hello World',
  description: 'This is a blog post',
  layout: 'blog',
  image: 'https://example.com/blog/hello-world.png',
})
//
useSchemaOrg([
  defineProduct({
    name: 'The Classic',
    description: 'The Classic is a classic',
    offers: [
      defineOffer({
        price: 15.50,
        priceCurrency: 'AUD',
        availability: 'https://schema.org/InStock',
      }).resolve(),
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
