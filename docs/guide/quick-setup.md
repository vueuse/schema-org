# Quick Setup

If you're not familiar with Schema.org, then the quickest way to get started is with the `defineBasicPreset`.

The preset will generate the Schema.org that is required for all pages: `WebPage` and `WebSite`.
It assumes your identity as an `Organization`. If you're creating a blog for yourself, see the guide below.

It's recommended you put this code in your `App.vue` or a default layout file.

```vue
<script setup lang="ts">
import { useSchemaOrg, defineBasicPreset } from "@vueuse/schema-org";

useSchemaOrg([
  defineBasicPreset({
    // your sites / brand name
    name: 'My App',
    logo: 'https://example.com/logo.png',
    // optional field, put all of your socials here
    sameAs: [
      'https://twitter.com/my-twitter-handle'
    ]
  })
])
</script>
```
