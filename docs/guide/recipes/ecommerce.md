# eCommerce

### Advanced: Article

Using the power of this package, we can define an article and have the Schema.org graph node link up everything
correctly to have the article as the main entity of the page.

The package comes with an integration with vue-router's meta feature. Providing meta as `title` and `description` will allow
Schema.org to be inferred.

```vue

<script setup lang="ts">
import {useSchemaOrg, defineArticle} from "vueuse-schema-org";

// nuxt
definePageMeta({
  title: 'My Article',
  description: 'This is an article about my life'
})

useSchemaOrg([
  defineArticle({
    datePublished: '2020-01-01',
    dateModified: '2020-01-01',
  })
])
</script>
```

Output:

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "dateModified": "2020-01-01",
  "datePublished": "2020-01-01",
  "headline": "My Article",
  "description": "This is an article about my life",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://vueuse.js.org/",
    "name": "vueuse.js.org"
  }
}
```
