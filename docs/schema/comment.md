# Vue Schema.org Comment

**Type**: `defineComment(comment: Comment)`

Describes a review. Usually, in the context of an Article or a WebPage.

::: warning
🔨 Documentation in progress
:::


## Type Definition

```ts
export interface Comment extends Thing {
  /**
   * The textual content of the comment, stripping HTML tags.
   */
  text: string
  /**
   *  A reference by ID to the parent Article (or WebPage, when no Article is present).
   */
  about?: IdReference
  /**
   * A reference by ID to the Person who wrote the comment.
   */
  author?: Person|IdReference
}
```
