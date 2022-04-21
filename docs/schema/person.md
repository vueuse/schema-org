# Vue Schema.org Person

**Type**: `definePerson(person: Person)`

Describes an individual person. Most commonly used to identify the author of a piece of content (such as an Article or Comment).

## References

- [Schema.org Person](https://schema.org/Person)

## Recommended Manual Configuration

- **name**: Person name
- **image**: Avatar image url

### Minimal Example
```ts
useSchemaOrg([
  definePerson({
    name: 'Harlan Wilton',
    image: '/me.png',
  }),
])
```

## Defaults

- **@type**: `Person`
- **@id**: `${canonicalHost}#identity`
- **url**: `canonicalHost`

## Resolves

- resolves relative string urls of `image`


## Type Definition

```ts
export interface Person extends Thing {
  /**
   * The full name of the Person.
   */
  name: string
  /**
   * The user bio, truncated to 250 characters.
   */
  description?: string
  /**
   * An array of URLs representing declared social/authoritative profiles of the person
   * (e.g., a Wikipedia page, or Facebook profile).
   */
  sameAs?: string[]
  /**
   * An array of images which represent the person, referenced by ID.
   */
  image: Arrayable<IdReference|ImageObject|string>
  /**
   * The URL of the users' profile page (if they're affiliated with the site in question),
   * or to their personal homepage/website.
   */
  url: string
}
```
