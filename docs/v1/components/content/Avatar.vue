<script setup lang="ts">
defineProps<{
  avatar: string
  name: string
  github: string
  twitter?: string
  sponsors?: boolean
}>()
</script>

<template>
  <div class="flex w-full max-w-xl mx-auto shadow border-1 border-green-100 p-5 my-20">
    <img :src="avatar" :alt="name" class="mx-auto rounded h-[100px] w-[100px] " height="100" width="100">
    <div class="text-left flex-grow ml-10">
      <div class="text-xs opacity-75">
        Created by
      </div>
      <div class="text-xl mt-1 mb-1">
        {{ name }}
      </div>
      <div class="op60">
        <slot />
      </div>
      <div class="py-4 flex items-center gap-4 text-2xl">
        <a
          :href="`https://github.com/${github}`"
          target="_blank"
        >
          <icon name="logos:github-icon"></icon>
        </a>
        <a
          :href="`https://twitter.com/${twitter}`"
          target="_blank"
        >
          <icon name="logos:twitter"></icon>
        </a>
      </div>
    </div>
  </div>
</template>
