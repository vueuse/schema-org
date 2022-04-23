# Choosing an Identity

Now you're serving basic Schema, it's a good time to identity your websites identity. 

Providing an identity may allow Google to display a prominent Google knowledge panel with details of the identity.

## Providers

While Schema.org provides very detailed types, it's recommended sticking to a single provider below.

If you're not sure which to use, you should select `Organization`.


**Organization (default)**

- Applicable to most websites
- Does not need to relate to an official business
- Used for eCommerce as well

Example: nuxtjs.org

**Person**

- Most useful for personal websites.
- Personal brands

Example: harlanzw.com

**Local Business**

- Physical businesses
- Extends an Organization

Example: onacoffee.com.au

Schema for the identity should be on every page with the `WebSite` and `WebPage`. Navigate to where you set up your previous
global Schema and add the provider you've chosen.

## Setting up Schema.org for an Organization in Vue

Using the Organization Schema Google may provide a= knowledge panel with details of your organization.

By using the `vueuse-search-org` package, you have access to the `defineOrganization` define which will inject [Organization](/schema/organization) Schema.

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
  // previous global schema
  defineWebPage(),
  defineWebSite({
    name: 'Nuxt',
    description: 'Nuxt is a progressive framework for building modern web applications with Vue.js',
  })
])
```

## Setting up Schema.org for a Personal Website in Vue

Creating a website for your own personal brand is a great way to showcase your work and gain an organic following.

By using the `vueuse-search-org` package, you have access to the `definePerson` define which will inject [Person](/schema/person) Schema.

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
  // previous global schema
  defineWebPage(),
  defineWebSite({
    name: 'Harlan Wilton',
    description: 'Personal website and blog where I share my thoughts and learn about web development',
  })
])
```

## Setting up Schema.org for a Local Business in Vue

See [Local Business](/schema/local-business) for full details on how to set up a Local Business.

**Quick Example**

```ts layouts/default.vue
import {definePostalAddress} from "./index";

useSchemaOrg([
  defineLocalBusiness({
    name: 'Juicy Bean Coffee',
    logo: '/logo.png',
    image: [
      '/photo-1.jpg',
      '/photo-2.jpg',
    ],
    sameAs: [
      'https://facebook.com/juicy-bean-coffee',
    ],
    "telephone": "+12122459600",
    "priceRange": "$$",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday"
        ],
        "opens": "11:30",
        "closes": "22:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Wednesday",
          "Thursday",
          "Friday"
        ],
        "opens": "11:30",
        "closes": "23:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "16:00",
        "closes": "23:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Sunday",
        "opens": "16:00",
        "closes": "22:00"
      }
    ],
    "menu": "http://www.example.com/menu",
    "acceptsReservations": "True",
    address: definePostalAddress({
      streetAddress: "148 W 51st St",
      addressLocality: "New York",
      addressRegion: "NY",
      postalCode: "10019",
      addressCountry: "US"
    })
  }),
  // previous global schema
  defineWebPage(),
  defineWebSite({
    name: 'Harlan Wilton',
    description: 'Personal website and blog where I share my thoughts and learn about web development',
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
