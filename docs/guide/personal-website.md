# Using Route Meta

By providing a `useRoute` function to `createSchemaOrg`, the package can hook into 
the page meta, minimising configuration when the meta is defined.

Most sites use `vue-router`, so you can pass the [useRoute](https://router.vuejs.org/api/#useroute) function in.
Assuming you have setup the package correctly, by providing meta you can make the most of the configuration automation.

## vue-router


## VitePress

When writing markdown files in VitePress you can provide page data through the frontmatter.



For example, in VitePress we have the exposed meta as follows:

<script setup>
import { useSchemaOrg } from 'vueuse-schema-org'
const { currentRouteMeta } = useSchemaOrg()
</script>

```json
{ 
  "title": "Using Route Meta",
  "description": "", 
  "frontmatter": {}, 
  "headers": [], 
  "relativePath": "guide/using-route-meta.md"
}
```
