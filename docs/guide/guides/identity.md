# Choosing an Identity

Providing an identity may allow Google to display a prominent Google knowledge panel with details of the identity.

## Providers

While Schema.org provides very detailed types, it's recommended to choose a single provider below.

If you're not sure which to use, you should select `Organization`.

Schema for the identity should be on every page with the `WebSite` and `WebPage`. Navigate to where you set up your previous
global Schema and add the provider you've chosen.

## Organization - default


- Applicable to most websites
- Does not need to relate to an official business
- Used for eCommerce as well

Example: nuxtjs.org

Using `defineOrganization` provides Organization Schema, see the [docs](/schema/organization) for full details on how to set it up.

**Quick Example** 

```ts layouts/default.vue
useSchemaOrg([
  defineOrganization({
    name: 'Nuxt.js',
    logo: '/logo.png',
    sameAs: [
      'https://twitter.com/nuxt_js'
    ]
  }),
  defineWebPage(),
  defineWebSite({
    // ...
  })
])
```

## Personal Website

- Personal website or blog
- Personal brands

Example: harlanzw.com

Using `definePerson` provides Person Schema, see the [docs](/schema/person) for full details on how to set it up.

**Quick Example**

```ts layouts/default.vue
useSchemaOrg([
  definePerson({
    name: 'Harlan Wilton',
    image: '/me.png',
    sameAs: [
      'https://twitter.com/harlan_zw',
      'https://github.com/harlan-zw',
    ]
  }),
  defineWebPage(),
  defineWebSite({
    // ...
  })
])
```

## Local Business

- Physical businesses
- Extends an Organization

Example: onacoffee.com.au

Using `defineLocalBusiness` provides LocalBusiness Schema, see the [docs](/schema/local-business) for full details on how to set it up.

**Quick Example**

```ts layouts/default.vue
import {definePostalAddress} from "./index";

useSchemaOrg([
  defineLocalBusiness({
    // ...
  }),
  defineWebPage(),
  defineWebSite({
    // ...
  })
])
```

## Automated Relations

Setting an identity will also cause default inferences to be made about the Schema your register:

[Articles](/schema/article)

- publisher is the identity
- authored by the identity

[Product](/schema/product)

- brand is the identity

[WebPage](/schema/webpage)

- home page uses the identity for `about`

[WebSite](/schema/website)

- publisher is the identity
