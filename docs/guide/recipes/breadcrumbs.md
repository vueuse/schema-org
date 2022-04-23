# Setting up Schema.org for Breadcrumbs in Vue

<script setup>
const breadcrumb = [ { item: '/', name: 'Home' }, { item: '/guide/recipes', name: 'Recipes' }, { name: 'Breadcrumbs' }]
</script>

<SchemaOrgBreadcrumb :items="breadcrumb" />

Creating breadcrumbs on your site is a great way to help your users understand your website hierarchy.

By using the `vueuse-search-org` package, you have access to [defineBreadcrumbs](/schema/breadcrumb) or
the `SchemaOrgBreadcrumb` component which will automatically generate Schema and applicable relations for you.

## Useful Links

- [defineBreadcrumb](/schema/breadcrumb)
- [Breadcrumb | Google Search Central](https://developers.google.com/search/docs/advanced/structured-data/breadcrumb)
- [Breadcrumb | Yoast](https://developer.yoast.com/features/schema/pieces/breadcrumb)

## Define Breadcrumbs

Providing the Schema.org for an Breadcrumb is straight-forward with minimal required fields.

### Composition API

```vue

<script setup lang="ts">
useSchemaOrg([
  defineBreadcrumb({
    // each entry will be resolved as a ListItem
    itemListElement: [
      // item is the url and will be resolved to the absolute url  
      { name: 'Home', item: '/' },
      { name: 'Articles', item: '/blog' },
      // item is not required for the last list element
      { name: 'How do breadcrumbs work' },
    ]
  }),
])
</script>
```

### Components

If you prefer to define your breadcrumb Schema in your template, you can make use of the `SchemaOrgBreadcrumb` component.

Imagine we want to reproduce the following and have the Schema generated.

[Home](/) / [Recipes](/guide/recipes/) / Breadcrumbs


```vue
<SchemaOrgBreadcrumb :items="breadcrumb" />
  <template #item="{ item, name }">
    <a v-if="item" :href="item">{{ name }}</a>
    <span v-else>{{ name }}</span>
  </template>
</SchemaOrgBreadcrumb>
```

<SchemaOrgInspector />
