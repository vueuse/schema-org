<script lang="ts" setup>
useSchemaOrg([
  definePerson({
    name: computed(() => {
      return 'Harlan'
    }),
    jobTitle: 'Software Engineer',
  }),
])
</script>

<template>
  <div>
    <SchemaOrgWebSite name="My Website" />
    <SchemaOrgWebPage />
    <NuxtPage />
  </div>
</template>
