# Setting Primary Image

Setting your pages primary image is a useful way to tell Google which page it should use when showing your site in search results.

It's most applicable for an [Article](/schema/article) but can also be used for a [WebPage](/schema/webpage).

## Useful Links

- [definePrimaryImage](/schema/image)

## Setup

### Composition API

```vue

<script setup lang="ts">
useSchemaOrg([
  definePrimaryImage({
    url: '/images/primary-image.jpg',
  }),
])
</script>
```

