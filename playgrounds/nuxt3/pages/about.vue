<script setup lang="ts">

definePageMeta({
  layout: 'default',
  title: 'About page',
  description: 'this is the about page',
})
</script>
<template>
  <div>
    <h1 class="text-7xl mb-20">
      {{ $route.meta.title }}
    </h1>
    <div class="text-xl font-light">
      <p class="mb-3">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium aperiam, aspernatur consequuntur corporis debitis eaque eveniet incidunt inventore provident quam, quas quasi tempore vel! Dolorum est pariatur quas quos sint?
      </p>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores aspernatur, at beatae debitis, dolores eum eveniet hic maiores minus optio quaerat sunt vel voluptate? Cupiditate quas quidem reiciendis tempora velit?</p>
    </div>
  </div>
</template>
