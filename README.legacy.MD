
## Link Previews 🔎

Easily configure your pages to show beautiful link previews.

### Configure Defaults

Set up the default behaviour for link previewing.

```ts
export default defineNuxtConfig({
  seaMeta: {
    linkPreview: {
      // default image
      image: 'https://placeimg.com/1200/600/any',
      // default twitter behaviour
      twitter: {
        card: 'summary', // summary_large_image is default
        handle: '@harlan_zw',
        // custom image for twitter
        image: 'https://placeimg.com/600/600/any',
      }
    }
  }
})
```

### useSeoMeta Composable

A composable is provided which will let you control all meta related to link previews.


```vue
<script setup lang="ts">
useSeoMeta({
  title: 'Home',
  description: 'Welcome to my home page where I show you some of my projects.',
})
</script>
```

Given the above options config, this would produce html like the following:
```html
<title>Home</title>
<meta name="title" content="Home">
<meta name="description" content="With Meta Tags you can edit and experiment with your content then preview how your webpage will look on Google, Facebook, Twitter and more!">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://my-app.com">
<meta property="og:title" content="Home">
<meta property="og:description" content="Welcome to my home page where I show you some of my projects.">
<meta property="og:image" content="https://placeimg.com/1200/600/any">

<!-- Twitter -->
<meta property="twitter:card" content="summary">
<!-- Twitter will read opengraph data when twitter: is not present -->
<meta property="twitter:image" content="https://placeimg.com/600/600/any">
```

**Overriding vendors**

You change the behaviour of specific vendors by passing in data for them. If you set a vendor to false then
tags will not be generated for them.

```vue
<script setup lang="ts">
useSeoMeta({
  title: 'Home',
  description: 'Welcome to my home page where I show you some of my projects.',
  image: 'https://images.unsplash.com/photo-1604689910903-68729001a0d4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
  twitter: {
    image: 'https://placehold.it/600x600',
  },
  // disable opengraph
  og: false,
})
</script>
```

**Title Template**

The `title` will make use of the `titleTemplate` if specified, where the `title` specified is the
`pageTitle`.


**Example: Share Support with extra labels (slack, twitter)**

This will generate a link preview on slack with extra meta data.

```vue
<script setup lang="ts">
useSeoMeta({
  title: 'Home',
  description: 'Welcome to my home page where I show you some of my projects.',
  image: 'https://images.unsplash.com/photo-1604689910903-68729001a0d4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
  // extra labels are supported for slack and twitter (products only)
  labels: [
    { label: 'Read Time', data: '1 min read' },
    { label: 'Published', data: '10th July 2021' },
  ]
})
</script>
```


## SEO Meta Composables

A lower level set of composable are available to interact with the meta data if you prefer defining your meta in this style.

### API

- `usMetaTitle(title string, { og?: string, twitter?: string })` - Set the page title, og title and twitter title.
- `usMetaDescription(description: string, { og?: string, twitter?: string })` - Set the meta, og and twitter description.
- `usMetaImage(ogImageUrl: string, { twitter?: string })` - The opengraph image is the default for images.
- `usMetaLabels(labels: { label: string, data: string }[])` - Set additional labels to be shown with the link preview.
- `useMetaLang(lang: string)` - Set the language for the page.

### Examples

```vue
<script setup lang="ts">
useMetaTitle('Home')
// <title>Home</title>
// <meta property="og:title" content="Home" />
useMetaImage('https://nuxtjs.org/img/logo.png', {
  twitter: 'https://nuxtjs.org/img/logo-600px.png'
})
// <meta property="og:image" content="https://nuxtjs.org/img/logo.png" />
// <meta property="twitter:image" content="https://nuxtjs.org/img/logo-600px.png" />
useMetaLabels([
  { label: 'Read Time', data: '1 min read' },
  { label: 'Published', data: '10th July 2021' },
])
// <meta name="twitter:label1" value="Read Time" />
// <meta name="twitter:data1" value="1 min read" />
// <meta name="twitter:label2" value="Published" />
// <meta name="twitter:data2" value="10th July 2021" />
</script>
```

### Vendor overrides

You can override either `twitter` or `og` which will override the value inheritance of these vendors.

```vue
<script setup lang="ts">
useMetaTitle('Home', { twitter: 'My Home page'})
// <title>Home</title>
// <meta property="og:title" content="Home" />
// <meta property="twitter:title" content="My home page" />
</script>
````


## Title Template 🧩

// @todo not sold on the API on this yet, but to give an idea

### Configuration

You can set a default title template for all pages to follow. You have access
to the following template vars:
- `pageTitle` - The `<title>` of the page
- `siteTitle` - This maps to your `app.name`

As well as any custom metadata that is exposed on the page meta.

```ts
export default defineNuxtConfig({
  seoMeta: {
    titleSeperator: '-',
    titleTemplate: ['{pageTitle}', '{siteTitle}'],
  }
})
```

### Composable

You can change the title template anywhere in your app by using the `useTitleTemplate` composable.

#### Layout Example

Within your layout file you would specify the title template to follow.

```vue
<script setup lang="ts">
useTitleTemplate(['{pageTitle}', '{subTitle}', '{siteTitle}'])
</script>
```

You can see we are referencing a custom value here, `{subTitle}`. This needs to be specified on your
pages meta.

You can do define your pages meta with the following:

```vue
<script setup lang="ts">
definePageMeta({
  subTitle: 'Test'
})
// will generate titles as: My Page Title - Test - My Site
</script>
```

You can reference any value specified within your pages meta.


## Intelligent robots config 🤖

By default, all pages will be indexable on your site. The robots.txt will be configured to allow
to full snippet expanding.

```html
<meta name="robots" content="max-snippet:-1, max-image-preview:large, max-video-preview:-1"/>
````

**Disable indexing**

When you disable indexing the page will be stripped of any meta that only a robot would read.

You can use this in a layout file if you'd like all pages which use this layout to not be indexable, such as a dashboard page.

```vue
<script setup lang="ts">
useMetaNoIndex(false)
// <meta name="robots" content="noindex">
// Removes any meta that will be used by robots
</script>
```

## Reactivity

While not useful for most of the meta as robots won't wait around for too long on javascript to execute, you can
use Vue reactivity features to change meta on demand.

```ts
// @todo
```
