# Choosing an Identity

Providing an identity may allow Google to display a prominent Google knowledge panel with details of the identity.

While Schema.org provides detailed types, it's recommended to choose a single provider below. If you're not sure which to use, you should select `Organization`.


## Organization


- Applicable to most websites
- Does not need to relate to an official business
- Used for eCommerce as well
- Example: nuxtjs.org, vuejs.org

Using `defineOrganization` or `SchemaOrgOrganization` by default will set your identity to an [Organization](/api/schema/organization).

### a. Composition API

```ts app.vue
useSchemaOrg([
  defineOrganization({
    name: 'My company',
    logo: '/logo.png',
    sameAs: [
      'https://twitter.com/company'
    ]
  }),
  defineWebSite({/* ... */}),
  defineWebPagePartial(),
])
```

### b. Component API

```vue app.vue
<template>
  <SchemaOrgOrganization 
    name="My company" 
    logo="/logo.png" 
    :same-as="['https://twitter.com/company']"
  />
  <SchemaOrgWebSite name="My Awesome Website" />
  <SchemaOrgWebPage />
  <RouterView />
</template>
```

## Person

- Personal website or blog
- Personal brands
- Example: harlanzw.com, antfu.me

Using `definePerson` or `SchemaOrgPerson` by default will set your identity to a [Person](/api/schema/person).

### a. Composition API

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

### b. Component API

```vue
<template>
  <SchemaOrgPerson
    name="Harlan Wilton" 
    image="/logo.png" 
    :same-as="['https://github.com/harlan-zw']"
  />
  <SchemaOrgWebSite name="My Awesome Website" />
  <SchemaOrgWebPage />
  <RouterView />
</template>
```

## Local Business

- Physical businesses, requires an address
- Extends an [Organization](/api/schema/organization)
- Example: onacoffee.com.au, intracbr.com.au

Using `defineLocalBusiness` or `SchemaOrgLocalBusiness` by default will set your identity to a [LocalBusiness](/api/schema/local-business).

### a. Composition API

```ts app.vue
useSchemaOrg([
  defineLocalBusiness({
    name: 'Harlan\'s Hamburgers',
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

### b. Component API

```vue
<template>
  <SchemaOrgLocalBusiness
    name="Harlan\'s Hamburgers" 
    image="/logo.png"
    :address="{
      streetAddress: '123 Main St',
      addressLocality: 'Harlan',
      addressRegion: 'MA',
      postalCode: '01234',
      addressCountry: 'US',
    }"
  />
  <SchemaOrgWebSite name="My Awesome Website" />
  <SchemaOrgWebPage />
  <RouterView />
</template>
```

## Automated Relations

Setting an identity will also cause default inferences to be made about the Schema your register:

[Articles](/api/schema/article)

- publisher is the identity
- authored by the identity

[Product](/api/schema/product)

- brand is the identity

[WebPage](/api/schema/webpage)

- home page uses the identity for `about`

[WebSite](/api/schema/website)

- publisher is the identity
