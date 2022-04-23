# Change Schema.org WebPage @type

Setting a specific WebPage type can be a useful way to tell Google about the content of the page.

This package uses augmentation for global schema,
see [Global Schema Augmentation](/guide/how-it-works.html#global-schema-augmentation)

Schema automation is also done on the page route to try and guess the ideal page type if you need to manually set if you can see 
the below example.

See [WebPage](/schema/webpage) for more information.

## Example

```vue
<script setup lang="ts">
useSchemaOrg([
  // make the current page an AboutPage
  defineWebPage({
    '@type': 'AboutPage'
  }),
])
</script>
```
