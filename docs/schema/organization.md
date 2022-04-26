# Vue Schema.org Organization

- **Type**: `defineOrganization(organization: Organization)`

  Describes an organization (a company, business or institution). Most commonly used to identify the publisher of a WebSite.

- **Type**: `defineOrganizationPartial(organization: DeepPartial<Organization>)`

  Alias: defineOrganization, less strict types. Useful for augmentation.


## Useful Links

- [Organization - Schema.org](https://schema.org/Organization)
- [Organization - Yoast](https://developer.yoast.com/features/schema/pieces/organization)
- [Choose an Identity - Organization](/guide/guides/identity.html#organization)

## Required properties

- **name** `string`

  The name of the business.

- **logo** `SingleImageInput`

  Logo image url, can be relative to your site root.

## Recommended Properties

- **sameAs**  `string[]`

  An array of URLs that also belong to the Organization

## Examples

### Minimal

```ts
defineOrganization({
  name: 'My Site',
  logo: '/logo.png',
  sameAs: [
    'https://www.facebook.com/my-site',
    'https://twitter.com/my-site',
    'https://www.instagram.com/my-site',
    'https://www.youtube.com/my-site',
  ]
})
```

## Defaults

- **@type**: `Organization`
- **@id**: `${canonicalHost}#identity`
- **url**: `canonicalHost`

## Resolves

See [Global Resolves](/guide/how-it-works.html#global-resolves) for full context.

- address as `PostalAddress` object

- resolves string urls of `logo` into a `ImageObject` with the id of `#logo`

For example:

```ts
defineOrganization({
  name: 'Nuxt.js',
  logo: '/img/logo.png',
})
```

Will resolve the logo url into an ImageObject with the id of `#logo`

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@id": "https://nuxtjs.org/#logo",
      "@type": "ImageObject",
      "url": "https://nuxtjs.org/img/logo.png"
    },
    {
      "@id": "https://nuxtjs.org/#identity",
      "@type": "Organization",
      "name": "Nuxt.js",
      "logo": {
        "@id": "https://nuxtjs.org/#logo"
      }
    }
  ]
}
```

## Type Definition

```ts
/**
 * An organization such as a school, NGO, corporation, club, etc.
 */
export interface Organization extends Thing {
  /**
   * A reference-by-ID to an image of the organization's logo.
   *
   * - The image must be 112x112px, at a minimum.
   * - Make sure the image looks how you intend it to look on a purely white background
   * (for example, if the logo is mostly white or gray,
   * it may not look how you want it to look when displayed on a white background).
   */
  logo: SingleImageInput
  /**
   * The site's home URL.
   */
  url?: string
  /**
   * The name of the Organization.
   */
  name: string
  /**
   * An array of URLs representing declared social/authoritative profiles of the organization
   * (e.g., a Wikipedia page, or Facebook profile).
   */
  sameAs?: string[]
  /**
   * An array of images which represent the organization (including the logo ), referenced by ID.
   */
  image?: ImageInput
  /**
   * A reference-by-ID to an PostalAddress piece.
   */
  address?: AddressInput
}
```
