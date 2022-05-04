# Choosing an Identity

Providing an identity may allow Google to display a prominent Google knowledge panel with details of the identity.

While Schema.org provides detailed types, it's recommended to choose a single provider below. If you're not sure which to use, you should select `Organization`.

[[toc]]


## Organization


- Applicable to most websites
- Does not need to relate to an official business
- Used for eCommerce as well
- Example: nuxtjs.org, vuejs.org

Using `defineOrganization` by default will set your identity to an [Organization](/schema/organization).

```ts app.vue
useSchemaOrg([
  defineOrganization({
    name: 'Nuxt.js',
    logo: '/logo.png',
    sameAs: [
      'https://twitter.com/nuxt_js'
    ]
  }),
  defineWebSite({/* ... */}),
  defineWebPagePartial(),
])
```

## Person

- Personal website or blog
- Personal brands
- Example: harlanzw.com, antfu.me

Using `definePerson` by default will set your identity to a [Person](/schema/person).

```ts app.vue
useSchemaOrg([
  definePerson({
    name: 'Harlan Wilton',
    image: '/me.png',
    sameAs: [
      'https://github.com/harlan-zw',
    ]
  }),
  defineWebSite({/* ... */}),
  defineWebPagePartial(),
])
```

## Local Business

- Physical businesses, requires an address
- Extends an [Organization](/schema/organization)
- Example: onacoffee.com.au, intracbr.com.au

Using `defineLocalBusiness` by default will set your identity to a [LocalBusiness](/schema/local-business).

```ts app.vue
useSchemaOrg([
  defineLocalBusiness({
    name: 'Harlan\'s Hamburgers',
    logo: 'https://emojiguide.org/images/emoji/n/3ep4zx1jztp0n.png',
    address: {
      streetAddress: '123 Main St',
      addressLocality: 'Harlan',
      addressRegion: 'MA',
      postalCode: '01234',
      addressCountry: 'US',
    },
    image: 'https://emojiguide.org/images/emoji/n/3ep4zx1jztp0n.png',
  }),
  defineWebSite({/* ... */}),
  defineWebPagePartial(),
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
