# Vue Schema.org Organization

**Type**: `defineOrganization(organization: Organization)`

Describes an organization (a company, business or institution). Most commonly used to identify the publisher of a WebSite.

## References

- [Schema.org Organization](https://schema.org/Organization)

## Recommended Manual Configuration

- **name**: Organization name
- **logo**: Logo image url

### Minimal Example
```ts
useSchemaOrg([
  defineWebSite({
    name: 'My Site',
    logo: 'https://example.com/logo.png',
  }),
])
```

## Defaults

- **@type**: `Organization`
- **@id**: `${canonicalHost}#identity`
- **url**: `canonicalHost`

## Resolves

- resolves string urls of `logo` into a `ImageObject` with the id of `#logo`

```ts
useSchemaOrg([
  defineOrganization({
    name: 'Nuxt.js',
    logo: '/img/logo.png',
  }),
  // equivalent to:
  defineImage({
    logo: '#logo',
    caption: 'Nuxt.js'
  }),
  defineOrganization({
    name: 'Nuxt.js',
    logo: '#logo',
  })
])
```

## Type Definition

```ts
export interface Organization extends Thing {
  /**
   * A reference-by-ID to an image of the organization's logo.
   *
   * - The image must be 112x112px, at a minimum.
   * - Make sure the image looks how you intend it to look on a purely white background
   * (for example, if the logo is mostly white or gray,
   * it may not look how you want it to look when displayed on a white background).
   */
  logo: IdReference
  /**
   * The site's home URL.
   */
  url: string
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
  image?: string[]|IdReference

  address?: unknown
}
```
