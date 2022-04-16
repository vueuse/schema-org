# Quick Setup

This package aims to get you up and running as quickly as possible with Schema.org that make a different
for your sites search appereance.

For this, it's recommended that you create some Schema.org entries for all public pages: `WebPage`, `WebSite` and an identity.

An identity can either be an `Organization` or a `Person`.
Most of the time an `Organization` will suite, unless your building a personal blog.

The recommended spot to put this configuration is in your `App.vue` file or a default layout file.

It's recommended you put this code in your `App.vue` or a default layout file.

```vue
<script setup lang="ts">
import { useSchemaOrg, defineBasicPreset } from "vueuse-schema-org";

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
