# Vue Schema.org Question

**Type**: `defineQuestion(question: Question)`

Describes an individual question. Most commonly used for creating an FAQ type page.

## Useful Links

- [Schema.org Question](https://schema.org/Question)
- [FAQ recipe](/guide/recipes/faq)

## Recommended Manual Configuration

- **name**: Question name
- **image**: Avatar image url

### Minimal Example
```ts
useSchemaOrg([
  defineQuestion({
    name: 'Harlan Wilton',
    image: '/me.png',
  }),
])
```

## Defaults

- **@type**: `Question`
- **@id**: `${canonicalHost}#identity`
- **url**: `canonicalHost`

## Resolves

- resolves relative string urls of `image`


## Type Definition

```ts
export interface Question extends Thing {
  /**
   * The full name of the Question.
   */
  name: string
  /**
   * The user bio, truncated to 250 characters.
   */
  description?: string
  /**
   * An array of URLs representing declared social/authoritative profiles of the question
   * (e.g., a Wikipedia page, or Facebook profile).
   */
  sameAs?: string[]
  /**
   * An array of images which represent the question, referenced by ID.
   */
  image: Arrayable<IdReference|ImageObject|string>
  /**
   * The URL of the users' profile page (if they're affiliated with the site in question),
   * or to their questional homepage/website.
   */
  url: string
}
```
