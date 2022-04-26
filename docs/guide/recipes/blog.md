# Setting up Schema.org for a Blog in Vue

Creating a blog is a fun way to share what you learn and grow a following through organic traffic.

Providing Schema.org can help improve your search appearance click-throughs rates by helping Google optimise how your site is shown.

[[toc]]

## Useful Links

- [defineArticle](/schema/article)
- [Article | Google Search Central](https://developers.google.com/search/docs/advanced/structured-data/article)
- [Article Schema | Yoast](https://developer.yoast.com/features/schema/pieces/article)

## Define an Article

By using the `vueuse-search-org` package, you have access to the `defineArticle` function which will inject [Article](/schema/article) Schema whilst handling
relations for you.

When defining your article you have two choices, either rely on the routes meta, or define the fields manually.

### Standard Configuration

```vue articles/my-article.vue
<script setup lang="ts">
useSchemaOrg([
  defineArticle({
    headline: 'Schema.org Guide',
    description: 'Discover how to use Schema.org'
    image: [
      'https://example.com/photos/16x9/photo.jpg'
    ],
    // dates will automatically be set to the right format
    datePublished: new Date(2020, 1, 1),
    dateModified: new Date(2020, 1, 1),
  })
])
</script>
```

### Route Meta Configuration

```vue articles/my-article.vue
<script setup lang="ts">
// nuxt route meta example
definePageMeta({
  title: 'Schema.org Guide',
  description: 'Discover how to use Schema.org',
  image: 'https://example.com/photos/16x9/photo.jpg',
  datePublished: new Date(2020, 1, 1),
  dateModified: new Date(2020, 1, 1),
})

useSchemaOrg([
  // article will use the pages meta
  defineArticle()
])
</script>
```


### Optional: Augment the Article @type

Providing a sub-level type of Article can help clarify what kind of content the page is about.

See the [Article Sub-Types](/schema/article.html#sub-types) for the list of available types.

```vue {4}
<script setup lang="ts">
useSchemaOrg([
  defineArticle({
    '@type': 'TechArticle',
    headline: 'My Article',
    // add some photos
    image: [
      'https://example.com/photos/16x9/photo.jpg'
    ],
    // dates will automatically be set to the right format
    datePublished: new Date(2020, 1, 1),
    dateModified: new Date(2020, 1, 1),
  })
])
</script>
```

### Optional: Providing an author

If the author of the article is not the same as the site identity (the `Person` or `Organization`), then you'll need to 
setup a separate author.

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

## Extra: Primary Image Markup

See the [Media Markup](/guide/guides/media-markup) guide.
Setting this will automatically set the articles `image`.

## Extra: Add Markup To Blog Archive Pages

Assuming you have the `WebPage` and `WebSite` schema loaded in from a parent layout component,
you can augment the `WebPage` type to better indicate the purpose of the page.

See [CollectionPage](https://schema.org/CollectionPage) for more information.

```vue layout/default.vue
<script lang="ts" setup">
useSchemaOrg([
  // make sure you're still defining your webpage and website
  defineWebPagePartial({
    '@type': 'CollectionPage'
  }),
])
</script>
```
