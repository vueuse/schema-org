# How it works

## Recommended Schema

The goal of the package is to provide you with Google Rich Results using minimal code you need to maintain.

For this, it's highly recommended that you configure core Schema globally: `WebPage`, `WebSite` and an [identity](/guide/guides/identity).

An identity can either be an `Organization` or a `Person`.
Most of the time an `Organization` will suite, unless your building a personal blog.

Within an `App.vue` or a `layouts/default.vue` you should have Schema which looks like the following.

```ts layouts/default.vue
useSchemaOrg([
  // identity, can be defineOrganization, definePerson or defineLocalBusiness
  defineOrganization({
    // ...
  }),
  defineWebPage(),
  defineWebSite({
    // ...
  })
])
```

With this setup the package can make assumptions on what Schema to further optimise.

For example, see the [Relation Transforms](/schema/article#relation-transforms) of an article. 

## Global Resolves

### Image paths

- `image` urls will be resolved to absolute


### @type augmentation

Providing a single string of `@type` will be augmented with the nodes default type, for example for an Article `TechArticle` -> `['Article' 'TechArticle']`

```ts
defineArticlePartial({
  // ['Article' 'TechArticle']
  '@type': 'TechArticle',
})
```

## Global Schema Augmentation

An extra perk of registering global Schema, is that you can make use of hierarchical
augmentation of the [WebPage](/schema/webpage) Schema.

Any changes you make in a parent layout or component will bubble down.

For example, if you have a collection of FAQ pages that all share one layout called `faq.vue`, you 
can simply [set the page type](/guide/guides/page-type) in one spot.



## Route Meta Resolving

To make configuration as minimal as possible, route meta will be used to infer automatic schema data. 
For example if you have a route meta of `title`, then we can infer the [WebPage](/schema/webpage) `title` should match.

Another reason for this is that other packages can also infer meaning from your routes meta, as well as for your own purposes.

The following meta keys are supported:

- **title**: `string` - The page title
- **description**: `string` - A short description of the page
- **dateModified**: `string|Date` - The date the page was last modified.
- **datePublished**: `string|Date` - The date the page was published
- **image**: `string` - Will be used as the primaryImage of the page

Each framework has their own way of setting up the meta on routes so consult your frameworks setup guide.

## Global config

When creating the client with `createSchemaOrg` you are able to provide global configuration which will be used to provide
default values where applicable.

The following options are used:

- **canonicalHost**: `string` 

  The production URL of your site. This allows the client to generate all URLs for you and is important to set correctly.

- **defaultLanguage**: `string`

  Will set the `isLanguage` to this value for any Schema which uses it. Should be a valid language code, i.e `en-AU`

- **defaultCurrency**: `string`

  Will set the `priceCurrency` for [Product](/schema/product) Offer Schema. Should be a valid currency code, i.e `AUD`

- **debug**: `boolean`

  Will enable debug logs to be shown.
