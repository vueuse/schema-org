# Vue Schema.org WebPage

- **Type**: `defineWebPage(webPage: WebPage)`

  Describes a single page on a WebSite. Acts as a container for sub-page elements (such as Article).

  Acts as a connector from a page's content to the parent WebSite (and in turn, to the Organization).

- **Type**: `defineWebPagePartial(webPage: DeepPartial<WebPage>)`

  Alias: defineWebPage, less strict types. Useful for augmentation.

## Useful Links

- [Schema.org WebPage](https://schema.org/WebPage)
- [Set Page Type](/guide/guides/page-type)
- [Recommended Schema](/guide/how-it-works.html#recommended-schema)

## Required properties

- **name** `string`

  The title of the page.

  A name can be provided using route meta on the `title` key, see [defaults](#defaults).

## Defaults

- **@type**: inferred from path, fallbacks to `WebPage`, see [resolves](#resolves)
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


## Examples

### Minimal

```ts
defineWebPage({
  title: 'Page Title',
  image: '/image.jpg',
})
```

### With Route Meta

```ts
// alternatively this can be configured on each route using page meta
setPageMeta({
  title: 'Page Title',
  image: '/image.jpg',
})

defineWebPagePartial()
```

## Type Definition

```ts
/**
 * A web page.
 * Every web page is implicitly assumed to be declared to be of type WebPage,
 * so the various properties about that webpage, such as breadcrumb may be used.
 */
export interface WebPage extends Thing {
  ['@type']: Arrayable<ValidSubTypes>
  /**
   * The unmodified canonical URL of the page.
   */
  url?: string
  /**
   * The title of the page.
   */
  name: string
  /**
   * The page's meta description content.
   */
  description?: string
  /**
   * A reference-by-ID to the WebSite node.
   */
  isPartOf?: MaybeIdReference<WebSite>
  /**
   * A reference-by-ID to the Organisation node.
   * Note: Only for the home page.
   */
  about?: MaybeIdReference<Organization>
  /**
   * A reference-by-ID to the author of the web page.
   */
  author?: AuthorInput
  /**
   * The language code for the page; e.g., en-GB.
   */
  inLanguage?: Arrayable<string>
  /**
   * The time at which the page was originally published, in ISO 8601 format; e.g., 2015-10-31T16:10:29+00:00.
   */
  datePublished?: ResolvableDate
  /**
   * The time at which the page was last modified, in ISO 8601 format; e.g., 2015-10-31T16:10:29+00:00.
   */
  dateModified?: ResolvableDate
  /**
   * A reference-by-ID to a node representing the page's featured image.
   */
  primaryImageOfPage?: SingleImageInput
  /**
   * A reference-by-ID to a node representing the page's breadrumb structure.
   */
  breadcrumb?: MaybeIdReference<BreadcrumbList>
  /**
   * An array of all videos in the page content, referenced by ID.
   */
  video?: Arrayable<MaybeIdReference<VideoObject>>
  /**
   * A SpeakableSpecification object which identifies any content elements suitable for spoken results.
   */
  speakable?: unknown
  /**
   * Potential actions for this web page.
   *
   * Use the `withReadAction` helper to add the read action. Note it's on by default for most page types.
   */
  potentialAction?: (ReadAction|unknown)[]
}
```
