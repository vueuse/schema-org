# Vue Schema.org WebSite

**Type**: `defineWebSite(partialWebSite: Partial<WebSite>)`

Describes a WebSite. Parent to WebPage.

## Useful Links

- [Schema.org WebSite](https://schema.org/WebSite)

## Recommended Manual Configuration

- **name**: Site name

### Minimal Example
```ts
useSchemaOrg([
  defineWebSite({
    name: 'My Site',
  }),
])
```

## Defaults

- **@type**: `WebSite`
- **@id**: `${canonicalHost}#website`
- **url**: `canonicalHost`
- **isPartOf**: WebSite reference
- **publisher**: Identity reference

## Type Definition

```ts
export interface WebSite extends Thing {
  '@type': 'WebSite'
  /**
   * The site's home URL (excluding a trailing slash).
   */
  url?: string
  /**
   * The name of the website.
   */
  name: string
  /**
   * A description of the website (e.g., the site's tagline).
   */
  description?: string
  /**
   * A reference-by-ID to the Organization which publishes the WebSite
   * (or an array of Organization and Person in the case that the website represents an individual).
   */
  publisher?: IdReference
  /**
   * A SearchAction object describing the site's internal search.
   */
  potentialAction?: unknown
  /**
   * The language code for the WebSite; e.g., en-GB.
   * If the website is available in multiple languages, then output an array of inLanguage values.
   */
  inLanguage?: string|string[]
}
```
