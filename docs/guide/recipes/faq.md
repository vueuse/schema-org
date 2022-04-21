# Setting up Schema.org for a FAQ in Vue

Creating a blog is a fun way to share what you learn and grow a following through organic traffic.

Providing Schema.org can help improve your organic reach by helping Google understand your content better,
allowing optimisation on your pages search appearance.

By using the `vueuse-search-org` package, you have access to the `defineArticle` function which will inject [Article](/schema/article) Schema.org whilst handling 
relations for you.

## Useful Links

- [Article | Google Search Central](https://developers.google.com/search/docs/advanced/structured-data/article)
- [Article Schema | Yoast](https://developer.yoast.com/features/schema/pieces/article)

## Setup

Providing the Schema.org for an article is straight-forward with minimal required fields.

```vue
<script setup lang="ts">
useSchemaOrg([
  defineArticle({
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

### Optional: Augment the Article @type

Providing a sub-level type of Article can help clarify what kind of content the page is about.

```vue
<script setup lang="ts">
useSchemaOrg([
  defineArticle({
    ['@type']: ['Article', 'TechArticle'],
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
setup a seperate author.

```vue

<script setup lang="ts">
import {idReference} from "vueuse-schema-org";

useSchemaOrg([
  definePerson({
    // Note: the id reference should always be unique, use a database if you have lots of authors
    '@id': '#author/1',
    name: 'John Doe',
  }),
  definePerson({
    // Note: the id reference should always be unique, use a database if you have lots of authors
    '@id': '#author/2',
    name: 'Jane Doe',
  }),
  defineArticle({
    // tell Google this is a TechArticle
    '@type': ['Article', 'TechArticle'],
    headline: 'My Article',
    // add some photos
    image: [
      'https://example.com/photos/16x9/photo.jpg'
    ],
    // dates will automatically be set to the right format
    datePublished: new Date(2020, 1, 1),
    dateModified: new Date(2020, 1, 1),
    author: [ idReference('#author/1'), idReference('#author/2') ],
  })
])
</script>
```

### Optional: Leveraging Page Meta

The package comes with an integration with vue-router's meta feature. Providing meta as `title` and `description` will allow
Schema.org to be inferred.

```vue
<script setup lang="ts">
// Nuxt implementation
definePageMeta({
  title: 'My Article',
  description: 'This is an article about my life'
})

useSchemaOrg([
  defineArticle({
    datePublished: new Date(2020, 1, 1),
    dateModified: new Date(2020, 1, 1),
  })
])
</script>
```

## Extra: Primary Image Markup

See the [Primary Image Markup](/guide/recipes/general-recommendations) guide in General Recommendations.
Setting this will automatically set the articles `image`.

## Extra: Add Markup To Blog Archive Pages

Assuming you have the `WebPage` and `WebSite` schema loaded in from a parent layout component,
you can augment the `WebPage` type to better indicate the purpose of the page.

See [CollectionPage](https://schema.org/CollectionPage) for more information.

```vue layout/default.vue
<script lang="ts" setup">
useSchemaOrg([
  // make sure you're still defining your webpage and website
  defineWebPage({
    '@type': 'CollectionPage'
  }),
])
</script>
```
