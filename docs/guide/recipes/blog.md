# Setting up Schema.org for a Blog in Vue

<SchemaOrgArticle image="/og.png" />

<BreadcrumbList :value="[ { item: '/', name: 'Home' }, { item: '/guide/recipes/', name: 'Recipes' }, { name: 'Blog' }]" />


Creating a blog is a fun way to share what you learn and grow a following through organic traffic.

Providing Schema.org can help improve your search appearance click-throughs rates
by helping Google optimise how your site is shown.

## Useful Links

- [Article | Google Search Central](https://developers.google.com/search/docs/advanced/structured-data/article)
- [Article Schema | Yoast](https://developer.yoast.com/features/schema/pieces/article)

## Marking up an Article

The [defineArticle](/schema/article) function and [SchemaOrgArticle](/components/article) component are provided
to create Article Schema whilst handling relations for you.

Note that some fields may already be inferred, see [Route Meta Resolving](/guide/how-it-works.html#route-meta-resolving)

### a. Using Composition

```vue articles/my-article.vue
<script setup lang="ts">
useSchemaOrg([
  defineArticle({
    // name and description can usually be inferred
    image: '/photos/16x9/photo.jpg',
    datePublished: new Date(2020, 1, 1),
    dateModified: new Date(2020, 1, 1),
  })
])
</script>
```

### b. Using Component

```vue articles/my-article.vue
<template>
  <SchemaOrgArticle 
    image="/photos/16x9/photo.jpg"
    :date-published="new Date(2020, 1, 1)"
    :date-modified="new Date(2020, 1, 1)"
   />
</template>
```

## Specifying the Article Type

Providing a sub-level type of Article can help clarify what kind of content the page is about.

See the [Article Sub-Types](/schema/article.html#sub-types) for the list of available types.

```vue
<script setup lang="ts">
useSchemaOrg([
  defineArticle({
    '@type': 'TechArticle',
    // ...
  })
])
</script>
```

## Providing an author

If the author of the article isn't the [site identity](/guide/guides/identity), then you'll need to 
config the author or authors.

```vue {10-19}
<script setup lang="ts">
useSchemaOrg([
  defineArticle({
    headline: 'My Article',
    image: [
      'https://example.com/photos/16x9/photo.jpg'
    ],
    datePublished: new Date(2020, 1, 1),
    dateModified: new Date(2020, 1, 1),
    author: [
      {
        name: 'John doe',
        url: 'https://johndoe.com',
      },
      {
        name: 'Jane doe',
        url: 'https://janedoe.com',
      },
    ]
  })
])
</script>
```

## Markup Blog Archive Pages

Assuming you have the `WebPage` and `WebSite` schema loaded in from a parent layout component,
you can augment the `WebPage` type to better indicate the purpose of the page.

See [CollectionPage](https://schema.org/CollectionPage) for more information.

```vue pages/blog/index.vue
<script lang="ts" setup">
useSchemaOrg([
  // make sure you're still defining your webpage and website
  defineWebPagePartial({
    '@type': 'CollectionPage'
  }),
])
</script>
```
