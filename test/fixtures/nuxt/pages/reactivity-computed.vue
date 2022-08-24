<script lang="ts" setup>
const post = ref(null)
useSchemaOrg([
  defineArticle({
    image: computed(() => post.value?.image),
    description: computed(() => post.value?.description),
    headline: computed(() => post.value?.headline),
  }),
])
post.value = {
  image: 'https://emojiguide.org/images/emoji/n/3ep4zx1jztp0n.png',
  description: 'Harlan Wilton - Last Name',
  headline: 'Harlan Wilton - Last Name',
}
</script>

<template>
  <div />
</template>
