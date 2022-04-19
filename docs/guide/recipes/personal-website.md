# Setting up Schema.org for a Personal Website in Vue

Creating a website for your own personal brand is a great way to showcase your work and gain organic traffic.

Providing Schema.org can help improve your organic reach by helping Google understand your content better, allowing them to
optimise how your pages search appearance.

By using the `vueuse-search-org` package, you have access to the `definePerson` define which will inject [Person](/schema/person) Schema.org.

Using `definePerson` without the `@id` attribute, will automatically setup the person to be the identity of the WebSite and author
of any content.

## Setup

To get up and running you'll need to make sure you set up your sites identity as a `Person`, instead of an `Organization`.

To do that simply paste the following in your root vue template (typically `App.vue` or `layout/default.vue`).

```vue layout/default.vue
<script lang="ts" setup">
useSchemaOrg([
  definePerson({
    name: 'Harlan Wilton',
    logo: 'https://harlanzw.com/assets/me.1492ee5e.png',
    sameAs: [
      'https://twitter.com/harlan_zw',
    ],
  }),
  // make sure you're still defining your webpage and website
  defineWebPage(),
  defineWebSite({
    name: 'Harlan\'s Blog',
  }),
])
</script>
```

## Next Steps

If your website is mostly static, you setup breadcrumb schema in minutes! See the [breadcrumb recipe](/guide/recipes/general-recommendations#breadcrumbs).

If your personal website has a blog, also check out the [blog setup recipe](/guide/recipes/blog.md).
