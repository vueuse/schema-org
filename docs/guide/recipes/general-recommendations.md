# General Recommendations


## Page Type Augmentation

## Page Schema.org Setup

Once you have setup your global Schema.org, it's now time to fine-tune what each page is serving.

To start with you can start specifying the types of your pages, then move on to Schema.org which will
benefit you in Google results.

### Basic: Page Type

Say you're working on a site with an about page. It's useful to specify the type as follows.

```vue
<script setup lang="ts">
import { useSchemaOrg, defineWebPage } from "vueuse-schema-org";

useSchemaOrg([
  // Because the @id isn't specified, this will merge with our global WebPage
  defineWebPage({
    '@type': 'AboutPage'
  })
])
</script>
```


## Marking up images
