# How it works


## Recommended Schema

This package aims to get you up and running as quickly as possible with Schema.org that make a different
for your sites search appropriate.

For this, it's recommended that you create some Schema.org entries for all public pages: `WebPage`, `WebSite` and an identity.

An identity can either be an `Organization` or a `Person`.
Most of the time an `Organization` will suite, unless your building a personal blog.

## Global Schema Augmentation

// re-registering webpage / website merges in values


## Route Meta Resolving

To make configuration as minimal as possible, route meta will be used to infer automatic schema data. For example if you
have a route meta of `title`, then we can infer the [WebPage](/schema/webpage) `title` should match.

The following meta keys are supported:

- **title**: `string` - The page title
- **description**: `string` - A short description of the page
- **dateModified**: `string|Date` - The date the page was last modified.
- **datePublished**: `string|Date` - The date the page was published
- **image**: `string` - Will be used as the primaryImage of the page

## Global config

When creating the client with `createSchemaOrg` you are able to provide global configuration which will be used to provide
default values where applicable.

The following options are used:

- **defaultLanguage**: `string` - Will set the `isLanguage` to this value for any Schema which uses it. Should be a valid language code, i.e `en-US`
- **canonicalHost**: `string` - The production URL of your site. This allows the client to generate all URLs for you and is important to set correctly.
