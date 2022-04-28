# SchemaOrgQuestion

Defines [Question Schema](/schema/question) for you based on the provided slots.

## API

### Props

- **items** -`itemListElement`
  - **name** - `string` The name of the page in question, as it appears in the breadcrumb navigation.
  - **item** - `string` The unmodified canonical URL of the page in question.

### Slots

- `item` - Provides scoped slot data of the [ListItem](/schema/list-item) object


## Example

```vue
<script setup>
const breadcrumb = [
  { item: '/', name: 'Home' },
  { item: '/guide/recipes', name: 'Recipes' },
  { name: 'Breadcrumbs' }
]
</script>
<template>
<SchemaOrgBreadcrumb :items="breadcrumb">
  <template #item="{ item, name }">
  <a v-if="item" :href="item">{{ name }}</a>
  <span v-else>{{ name }}</span>
  </template>
</SchemaOrgBreadcrumb>
</template>
```
