# Vue Schema.org Image

// @todo

**Type**: `defineLocalBusiness(article: Article)`

Describes an `Article` on a `WebPage`.

## References

- [Schema.org Article](https://schema.org/Article)
- [Article Structed Data](https://developers.google.com/search/docs/advanced/structured-data/article)
- [Recipe: Blog](/guide/recipes/blog)

## Recommended Manual Configuration

- **author** Link author(s) to the article
- **image** Link images used to the article
- **@type** Select the most appropriate type from [sub-types](#sub-types)

### Minimal Example

```ts
// set the routes meta, these will automatically be used
setPageMeta({
  title: 'Article Title',
  description: 'Article description',
  image: '/articles/article-title-image.jpg',
  datePublished: new Date(2020, 19, 1),
  dateModified: new Date(2020, 19, 1),
})

useSchemaOrg([
  defineArticle(),
])
```

## Defaults

- **@type**: `Article`
- **@id**: `${canonicalUrl}#article`
- **headline**: `currentRouteMeta.title` _(see: [route meta resolving](/guide/how-it-works.html#route-meta-resolving))_
- **image**: `currentRouteMeta.image` _(see: [route meta resolving](/guide/how-it-works.html#route-meta-resolving))_
- **description**: `currentRouteMeta.description` _(see: [route meta resolving](/guide/how-it-works.html#route-meta-resolving))_
- **inLanguage**: `options.defaultLanguage` _(see: [global config](/guide/how-it-works.html#global-config))_
- **datePublished**: `currentRouteMeta.datePublished` _(see: [route meta resolving](/guide/how-it-works.html#route-meta-resolving))_
- **dateModified**: `currentRouteMeta.dateModified` _(see: [route meta resolving](/guide/how-it-works.html#route-meta-resolving))_
- **publisher**: Identity Reference
- **author**: Identity Reference
- **isPartOf**: WebPage Reference
- **mainEntityOfPage**: WebPage Reference

## Sub-Types

- `AdvertiserContentArticle`
- `NewsArticle`
- `Report`
- `SatiricalArticle`
- `ScholarlyArticle`
- `SocialMediaPosting`
- `TechArticle`

## Relation Transforms

[WebPage](/schema/webpage)

- sets default `potentialAction` to `ReadAction`
- sets default `dateModified` to articles `dateModified`
- sets default `datePublished` to articles `datePublished`
- sets default `author` to articles `author`
- sets default `primaryImageOfPage` to articles first image

## Resolves

- `thumbnailUrl` will be set to the first image

- `dateModified` or `datePublished` can be resolved from Date objects 

```ts
defineArticle({
  // will resolve to ISO 8601 format
  datePublished: new Date(2020, 10, 1)
})
```

- providing a single string of `@type` which isn't `Article` will convert it to an array `TechArticle` -> `['Article', 'TechArticle']`

```ts
defineArticle({
  // will be resolved as ['Article', 'TechArticle']
  '@type': 'TechArticle',
})
```

## Type Definition

```ts
type ValidArticleSubTypes = 'Article'|'AdvertiserContentArticle'|'NewsArticle'|'Report'|'SatiricalArticle'|'ScholarlyArticle'|'SocialMediaPosting'|'TechArticle'

export interface Article extends Thing {
  ['@type']: ValidArticleSubTypes[]|ValidArticleSubTypes
  /**
   * The headline of the article (falling back to the title of the WebPage).
   * Headlines should not exceed 110 characters.
   */
  headline?: string
  /**
   * A summary of the article (falling back to the page's meta description content).
   */
  description?: string
  /**
   * A reference-by-ID to the WebPage node.
   */
  isPartOf?: IdReference
  /**
   * The time at which the article was originally published, in ISO 8601 format; e.g., 2015-10-31T16:10:29+00:00.
   */
  datePublished?: string|Date
  /**
   * The time at which the article was last modified, in ISO 8601 format; e.g., 2015-10-31T16:10:29+00:00.
   */
  dateModified?: string|Date
  /**
   * A reference-by-ID to the author of the article.
   */
  author?: IdReference|IdReference[]
  /**
   * A reference-by-ID to the publisher of the article.
   */
  publisher?: IdReference
  /**
   * An image object (or array of all images in the article content), referenced by ID.
   * - Must be at least 696 pixels wide.
   * - Must be of the following formats+file extensions: .jpg, .png, .gif ,or .webp.
   */
  image?: IdReference|IdReference[]|string|string[]
  /**
   * An array of all videos in the article content, referenced by ID.
   */
  video?: IdReference[]
  /**
   * An array of references by ID to comment pieces.
   */
  comment?: IdReference[]
  /**
   * An integer value of the number of comments associated with the article.
   */
  commentCount?: number
  /**
   * An integer value of the number of words in the article.
   */
  wordCount?: number
  /**
   * An array of keywords which the article has (e.g., ["cats","dogs","cake"]).
   */
  keywords?: string[]
  /**
   * An array of category names which the article belongs to (e.g., ["cats","dogs","cake"]).
   */
  articleSection?: string[]
  /**
   * The language code for the article; e.g., en-GB.
   */
  inLanguage?: string
  /**
   * A SpeakableSpecification object which identifies any content elements suitable for spoken results.
   */
  speakable?: unknown
  /**
   * The year from which the article holds copyright status.
   */
  copyrightYear?: string
  /**
   * A reference-by-ID to the Organization or Person who holds the copyright.
   */
  copyrightHolder?: IdReference
}
```
