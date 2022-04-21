# Vue Schema.org Recipe

**Type**: `defineRecipe(recipe: Recipe)`

Describes a Recipe, which contains a series of instructions, ingredients, and optional fields.


## References

- [Schema.org Recipe](https://schema.org/Recipe)
- [Recipe Structed Data](https://developers.google.com/search/docs/advanced/structured-data/recipe)

## Recommended Manual Configuration

- **author** Link author(s) to the recipe
- **image** Link images used to the recipe
- **@type** Select the most appropriate type from [sub-types](#sub-types)

### Minimal Example

```ts
// set the routes meta, these will automatically be used
setPageMeta({
  title: 'Recipe Title',
  description: 'Recipe description',
  image: '/recipes/recipe-title-image.jpg',
  datePublished: new Date(2020, 19, 1),
  dateModified: new Date(2020, 19, 1),
})

useSchemaOrg([
  defineRecipe(),
])
```

## Defaults

- **@type**: `Recipe`
- **@id**: `${canonicalUrl}#recipe`
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

- `AdvertiserContentRecipe`
- `NewsRecipe`
- `Report`
- `SatiricalRecipe`
- `ScholarlyRecipe`
- `SocialMediaPosting`
- `TechRecipe`

## Relation Transforms

[WebPage](/schema/webpage)

- sets default `potentialAction` to `ReadAction`
- sets default `dateModified` to recipes `dateModified`
- sets default `datePublished` to recipes `datePublished`
- sets default `author` to recipes `author`
- sets default `primaryImageOfPage` to recipes first image

## Resolves

- `thumbnailUrl` will be set to the first image

- `dateModified` or `datePublished` can be resolved from Date objects 

```ts
defineRecipe({
  // will resolve to ISO 8601 format
  datePublished: new Date(2020, 10, 1)
})
```

- providing a single string of `@type` which isn't `Recipe` will convert it to an array `TechRecipe` -> `['Recipe', 'TechRecipe']`

```ts
defineRecipe({
  // will be resolved as ['Recipe', 'TechRecipe']
  '@type': 'TechRecipe',
})
```

## Type Definition

```ts
type ValidRecipeSubTypes = 'Recipe'|'AdvertiserContentRecipe'|'NewsRecipe'|'Report'|'SatiricalRecipe'|'ScholarlyRecipe'|'SocialMediaPosting'|'TechRecipe'

export interface Recipe extends Thing {
  ['@type']: ValidRecipeSubTypes[]|ValidRecipeSubTypes
  /**
   * The headline of the recipe (falling back to the title of the WebPage).
   * Headlines should not exceed 110 characters.
   */
  headline?: string
  /**
   * A summary of the recipe (falling back to the page's meta description content).
   */
  description?: string
  /**
   * A reference-by-ID to the WebPage node.
   */
  isPartOf?: IdReference
  /**
   * The time at which the recipe was originally published, in ISO 8601 format; e.g., 2015-10-31T16:10:29+00:00.
   */
  datePublished?: string|Date
  /**
   * The time at which the recipe was last modified, in ISO 8601 format; e.g., 2015-10-31T16:10:29+00:00.
   */
  dateModified?: string|Date
  /**
   * A reference-by-ID to the author of the recipe.
   */
  author?: IdReference|IdReference[]
  /**
   * A reference-by-ID to the publisher of the recipe.
   */
  publisher?: IdReference
  /**
   * An image object (or array of all images in the recipe content), referenced by ID.
   * - Must be at least 696 pixels wide.
   * - Must be of the following formats+file extensions: .jpg, .png, .gif ,or .webp.
   */
  image?: IdReference|IdReference[]|string|string[]
  /**
   * An array of all videos in the recipe content, referenced by ID.
   */
  video?: IdReference[]
  /**
   * An array of references by ID to comment pieces.
   */
  comment?: IdReference[]
  /**
   * An integer value of the number of comments associated with the recipe.
   */
  commentCount?: number
  /**
   * An integer value of the number of words in the recipe.
   */
  wordCount?: number
  /**
   * An array of keywords which the recipe has (e.g., ["cats","dogs","cake"]).
   */
  keywords?: string[]
  /**
   * An array of category names which the recipe belongs to (e.g., ["cats","dogs","cake"]).
   */
  recipeSection?: string[]
  /**
   * The language code for the recipe; e.g., en-GB.
   */
  inLanguage?: string
  /**
   * A SpeakableSpecification object which identifies any content elements suitable for spoken results.
   */
  speakable?: unknown
  /**
   * The year from which the recipe holds copyright status.
   */
  copyrightYear?: string
  /**
   * A reference-by-ID to the Organization or Person who holds the copyright.
   */
  copyrightHolder?: IdReference
}
```
