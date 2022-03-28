![Nuxt SEO Meta](https://repository-images.githubusercontent.com/474912715/9962e6fd-3b79-4f19-9b32-73ce8acc8bb2
)


<p align="center">
<table>
<tbody>
<td align="center">
<img width="2000" height="0" /><br>
<i>Status:</i> <b>In Development 🔨</b><br>
<sub>Made possible by my <a href="https://github.com/sponsors/harlan-zw">Sponsor Program 💖</a><br> Follow me <a href="https://twitter.com/harlan_zw">@harlan_zw</a> 🐦</sub><br>
<img width="2000" height="0" />
</td>
</tbody>
</table>
</p>


## Features

- 🔎 Automatic Link Previews (Facebook, Twitter, slack, etc)
- 📰 Automatic Schema.org Generation and composables
- 🧩 Advanced Title template support
- 🍞 Breadcrumbs Schema.org composable
- 🤖 Intelligent robots config

### Install

```bash
# NPM
npm install -D nuxt-seo-meta-kit
# or Yarn
yarn add -D nuxt-seo-meta-kit
# or PNPM
pnpm add -D nuxt-seo-meta-kit
```

# Usage

Within your `nuxt.config.ts` add the following.

```ts
export default defineNuxtConfig({
  buildModules: [
    'nuxt-seo-meta'
  ],
})
```

Configure the default app fields for your site.

```ts
export default defineNuxtConfig({
  // ...
  app: {
    // issue needs to be made to add support for these  
    // see: https://github.com/nuxt/framework/discussions/3866#discussioncomment-2451111
    name: 'My App Domain',
    domain: 'https://my-app.com',
  }
})
```

Once setup you can configure the behaviour of the module on the `seoMeta` key and 
make use of the available composables.

- [Link previews](#link-previews)
- [SEO Meta Composables](#seo-meta-composables)
- [Schema.org](#schema-org)
- [Title template](#title-template)
- [Breadcrumbs](#breadcrumbs)
- [Robots config](#intelligent-robots-config)

## Link Previews 🔎

Easily configure your pages to show beautiful link previews. 

### Optional: Configure Defaults

Set up the default behaviour for link previewing. 

```ts
export default defineNuxtConfig({
  seaMeta: {
    // default link preview behaviour  
    linkPreview: {
      image: 'https://placeimg.com/1200/600/any',
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

**Example: Basic Share Support**

```vue
<script setup lang="ts">
usMetaLinkPreview({
  title: 'Home',
  description: 'Welcome to my home page where I show you some of my projects.',
  // use default image
})
</script>
```

**Example: Share Support with extra labels (slack, twitter)**

```vue
<script setup lang="ts">
usMetaLinkPreview({
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

**Example: Share Support with vendor overrides**

```vue
<script setup lang="ts">
usMetaLinkPreview({
  title: 'Home',
  description: 'Welcome to my home page where I show you some of my projects.',
  image: 'https://images.unsplash.com/photo-1604689910903-68729001a0d4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
  twitter: {
    image: 'https://placehold.it/600x600',
  }
})
</script>
```

## SEO Meta Composables

A lower level set of composable are available to interact with the meta data if you prefer defining your meta in this style.
Useful if you don't care about link previews.

### API

- `usMetaTitle(title string, { og?: string, twitter?: string })` - Set the page title, og title and twitter title.
- `usMetaDescription(description: string, { og?: string, twitter?: string })` - Set the meta, og and twitter description.
- `usMetaImage(ogImageUrl: string, { twitter?: string })` - The opengraph image is the default for images.

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


## Schema.org 📰

The highest leverage schema.org data has been abstracted into a simple configuration `seoMeta.schema` which
will generate everything you need for Google to start showing your result in their Knowledge Graph. 

Additionally, composables are available to change the generated page schema. 

### SEO Meta Schema

#### Organisation

If you're creating a website for a brand, then you'll want to setup the organisation meta.

```ts
export default defineNuxtConfig({
  seoMeta: {
    schema: {
      organisation: {
        // name will match app.name by default  
        logo: 'https://my-business.com/logo.png',
        socialProfies: {
          facebook: 'https://www.facebook.com/nuxtjs',
        },
      },
    }
  }
})
```

#### Person

If you're creating a site about a person, such as a blog, then you'll want to use the `person` schema.

```ts
export default defineNuxtConfig({
  seoMeta: {
    schema: {
      person: {
        // name will match app.name by default  
        name: 'Harlan Wilton',
        image: 'https://pbs.twimg.com/profile_images/1296047415611387904/bI-fltZ4_normal.jpg',
      },
    }
  }
})
```


#### Extending Schema

// @todo

### Composables

### API

- `useSchemaOrgPageType(type: SupportedSchemaOrgPageType, options)`
 
  Set page type

- `useSchemaOrgArticleType(type: SupportedSchemaOrgArticleType, options)`
  
  Mark the page as displaying an article and set the type


```vue
<script setup lang="ts">
// mark the page as an about page
useSchemaOrgPageType('AboutPage')
</script>
```

```vue
<script setup lang="ts">
// mark the page as an about page
useSchemaOrgArticleType('TechArticle')
</script>
```

## Title Template 🧩

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

You can reference any value 



## Breadcrumbs 🍞

// @todo This needs some more thought

```vue
<script setup lang="ts">
const breadcrumbs = [
  {
    name: 'Home',
    url: '/'
  },
  {
    name: 'About',
    url: '/about'
  }
]

useSchemaOrgBreadcrumbs(breadcrumbs)
</script>
```


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



## Sponsors

<p align="center">
  <a href="https://raw.githubusercontent.com/harlan-zw/static/main/sponsors.png">
    <img src='https://raw.githubusercontent.com/harlan-zw/static/main/sponsors.png'/>
  </a>
</p>


## License

MIT License © 2022 [Harlan Wilton](https://github.com/harlan-zw)__
