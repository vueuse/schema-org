# Vue Schema.org Video

- **Type**: `defineVideo(video: VideoObject)`

  Describes an individual video (usually in the context of an embedded media object).

- **Type**: `defineVideoPartial(video: DeepPartial<VideoObject>)`

  Alias: defineVideo, less strict types. Useful for augmentation.


## Useful Links

- [VideoObject - Schema.org](https://schema.org/VideoObject)
- [Video - Yoast](https://developer.yoast.com/features/schema/pieces/video)
- [Image / Video Markup](/guide/guides/media-markup.html)

## Required properties

- **name** `string`

  The title of the video.

  Can be provided using route meta on the `title` key, see [defaults](#defaults).

- **description** `string`

  A description of the video (falling back to the caption, then to 'No description').

  Can be provided using route meta on the `description` key, see [defaults](#defaults).

- **thumbnailUrl** `string`

  An image of the video thumbnail.

  Can be provided using route meta on the `image` key, see [defaults](#defaults).

- **uploadDate** `string`

  The date the video was published, in ISO 8601 format

  Can be provided using route meta on the `datePublished` key, see [defaults](#defaults).

## Defaults

- **@type**: `VideoObject`
- **@id**: `${canonicalUrl}#/schema/video/${hash(image.url)}`
- **inLanguage**: `options.defaultLanguage` (only when caption is provided) _(see: [global config](/guide/how-it-works.html#global-config))_
- **contentUrl**: is set to `url`


## Resolves

See [Global Resolves](/guide/how-it-works.html#global-resolves) for full context.

- `width` and `height` must be provided for either to be included

## Examples


### Minimal

```ts
defineImage({
  url: '/cat.jpg',
})
```


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
