# Vue Schema.org Video


**Type**: `defineVideo(video: Video)`

Describes an individual video (usually in the context of an embedded media object).

::: warning
🔨 Documentation in progress
:::

## Type Definition

```ts
export interface VideoObject extends ImageObject {
  /**
   * The title of the video.
   */
  name?: string
  /**
   * A description of the video (falling back to the caption, then to 'No description').
   */
  description?: string
  /**
   * A reference-by-ID to an imageObject.
   */
  thumbnailUrl?: string
  /**
   * The date the video was published, in ISO 8601 format (e.g., 2020-01-20).
   */
  uploadDate: string|Date
  /**
   * Whether the video should be considered 'family friendly'
   */
  isFamilyFriendly?: boolean
}
```
