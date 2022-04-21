<script lang="ts" setup>
const nav = [{ name: 'Home', item: '/' }, { name: 'About', item: '/about' }, { name: 'Articles', item: '/blog' }, { name: 'Shop', item: '/shop' }]
</script>
<template>
<div class="bg-blue-50 h-screen flex pb-20 flex-col items-center justify-center">
  <div class="mb-20 gap-5 container mx-auto">
  </div>
  <div class="container mx-auto flex items-center gap-20">
    <div class="w-full max-h-900px overflow-y-auto ">
      <!--        <SchemaOrgBreadcrumb class="gap-5 flex mb-5">-->
      <!--          <template #item="{ name, link, isActive }">-->
      <!--            <span v-if="isActive">-->
      <!--              {{ name }}-->
      <!--            </span>-->
      <!--            <NuxtLink v-else :to="link" class="underline">-->
      <!--              {{ name }}-->
      <!--            </NuxtLink>-->
      <!--          </template>-->
      <!--        </SchemaOrgBreadcrumb>-->
      <h1 class="text-7xl mb-20">
        {{ $route.meta.title }}
      </h1>
      <slot />
    </div>
  </div>
</div>
</template>
