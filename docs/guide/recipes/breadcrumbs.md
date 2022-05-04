# Setting up Schema.org for Breadcrumbs in Vue

<SchemaOrgArticle image="/og.png" />

<BreadcrumbList :value="[ { item: '/', name: 'Home' }, { item: '/guide/recipes/', name: 'Recipes' }, { name: 'Breadcrumbs' }]" />

Creating breadcrumbs on your site is a great way to help your users understand your website hierarchy.

## Useful Links

- [Breadcrumb | Google Search Central](https://developers.google.com/search/docs/advanced/structured-data/breadcrumb)
- [Breadcrumb | Yoast](https://developer.yoast.com/features/schema/pieces/breadcrumb)

## Marking up Breadcrumbs

The [defineBreadcrumb](/schema/breadcrumb) function and [SchemaOrgBreadcrumb](/components/breadcrumb) component are provided
to create Breadcrumb Schema whilst handling relations for you.

### a. Using Composition

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

### b. Using Component

If you prefer to define your breadcrumb Schema in your template, you can make use of the `SchemaOrgBreadcrumb` component.

Imagine we want to reproduce the following and have the Schema generated.

[Home](/) / [Recipes](/guide/recipes/) / Breadcrumbs


```vue
<SchemaOrgBreadcrumb :value="breadcrumb">
  <template #item="{ item }">
    <a v-if="item.item" :href="item.item">{{ item.name }}</a>
    <span v-else>{{ item.name }}</span>
  </template>
</SchemaOrgBreadcrumb>
```
