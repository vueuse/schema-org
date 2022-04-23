# Vue Schema.org Breadcrumb

// @todo

**Type**: `defineWebPage(partialWebPage: Partial<WebPage>)`

Describes a single page on a WebSite. Acts as a container for sub-page elements (such as Article).

Acts as a connector from a page's content to the parent WebSite (and in turn, to the Organization).

## Useful Links

- [Schema.org WebPage](https://schema.org/WebPage)

## Recommended Manual Configuration

No manual configurations are necessary.

### Minimal Example
```ts
// set the routes meta, these will automatically be used
setPageMeta({
  title: 'Page Title',
  image: 'https://example.com/image.jpg',
})

useSchemaOrg([
  defineWebPage(),
])
```


## Defaults

- **@type**: inferred from path, fallbacks to `WebPage`
- **@id**: `${canonicalUrl}#webpage`
- **url**: `canonicalUrl`
- **name**: `currentRouteMeta.title` _(see: [route meta resolving](/guide/how-it-works.html#route-meta-resolving))_
- **isPartOf**: WebSite reference

Home page only
- **about**: Identity Reference 
- **primaryImageOfPage**: Logo reference

## Sub-Types

- `AboutPage`
- `CheckoutPage`
- `CollectionPage`
- `ContactPage`
- `FAQPage`
- `ItemPage`
- `MedicalWebPage`
- `ProfilePage`
- `QAPage`
- `RealEstateListing`
- `SearchResultsPage`

## Relation Transforms

[WebPage](/schema/webpage)

- sets `potentialAction` to `ReadAction`
- sets `dateModified` to articles `dateModified`
- sets `datePublished` to articles `datePublished`

## Resolves

- `dateModified` or `datePublished` can be resolved from Date objects 

```ts
defineWebPage({
  // will resolve to ISO 8601 format
  datePublished: new Date(2020, 10, 1)
})
```

- providing a single string of `@type` which isn't `WebPage` will convert it to an array `TechArticle` -> `['WebPage', 'AboutPage']`

```ts
defineWebPage({
  // will be resolved as ['WebPage', 'AboutPage']
  '@type': 'AboutPage',
})
```

- @type based on last URL path

  -- `/about`, `/about-us` -> `AboutPage`

  -- `/search` -> `SearchResultsPage`

  -- `/checkout` -> `CheckoutPage`

  -- `/contact`, `/get-in-touch`, `/contact-us` -> `ContactPage`

  -- `/faq` -> `FAQPage`

## Type Definition

```ts
type ValidSubTypes = 'WebPage'|'AboutPage' |'CheckoutPage' |'CollectionPage' |'ContactPage' |'FAQPage' |'ItemPage' |'MedicalWebPage' |'ProfilePage' |'QAPage' |'RealEstateListing' |'SearchResultsPage'

export interface WebPage extends Thing {
  ['@type']: ValidSubTypes[]|ValidSubTypes
  /**
   * The unmodified canonical URL of the page.
   */
  url?: string
  /**
   * The title of the page.
   */
  name?: string
  /**
   * A reference-by-ID to the WebSite node.
   */
  isPartOf?: IdReference
  /**
   * A reference-by-ID to the Organisation node.
   * Note: Only for the home page.
   */
  about?: IdReference
  /**
   * A reference-by-ID to the author of the web page.
   */
  author?: IdReference|IdReference[]
  /**
   * The language code for the page; e.g., en-GB.
   */
  inLanguage?: string|string[]
  /**
   * The time at which the page was originally published, in ISO 8601 format; e.g., 2015-10-31T16:10:29+00:00.
   */
  datePublished?: string|Date
  /**
   * The time at which the page was last modified, in ISO 8601 format; e.g., 2015-10-31T16:10:29+00:00.
   */
  dateModified?: string|Date
  /**
   * A reference-by-ID to a node representing the page's featured image.
   */
  primaryImageOfPage?: IdReference
  /**
   * A reference-by-ID to a node representing the page's breadrumb structure.
   */
  breadcrumb?: IdReference
  /**
   * An array of all images in the page content, referenced by ID (including the image referenced by the primaryImageOfPage).
   */
  image?: IdReference[]
  /**
   * An array of all videos in the page content, referenced by ID.
   */
  video?: IdReference[]
  /**
   * A SpeakableSpecification object which identifies any content elements suitable for spoken results.
   */
  speakable?: unknown
}
```
