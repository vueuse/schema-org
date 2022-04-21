
### Breadcrumbs 🍞

You can either use the `useSchemaOrgBreadcrumbs` or the `SchamaOrgBreadcrumbs` component.

### Composable

```vue
<script setup lang="ts">
const breadcrumbs = [
  {
    name: 'Home',
    url: '/'
  },
  {
    name: 'About',
    url: '/about'
  }
]

useSchemaOrgBreadcrumbs(breadcrumbs)
</script>
```

### Headless UI component

```vue
<template>
<SchamaOrgBreadcrumbs :items="items">
  <template #link="{ text, link }">>
    <nuxt-link :to="link">text</nuxt-link>
  </template>
</SchamaOrgBreadcrumbs>
</template>
```

