<script lang="ts" setup>
import { SchemaOrgWebPage } from '#vueuse/schema-org/runtime'
</script>
<template>
  <div class="about">
    <SchemaOrgWebPage name="About" type="AboutPage" />
    <h1>This is an about page</h1>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
