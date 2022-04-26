# Vue Schema.org Image


- **Type**: `defineImage(image: Image)`

Describes an individual image (usually in the context of an embedded media object).

- **Type**: `defineImagePartial(image: DeepPartial<Image>)`

  Alias: defineImage, less strict types. Useful for augmentation.


## Useful Links

- [ImageObject - Schema.org](https://schema.org/ImageObject)
- [Image - Yoast](https://developer.yoast.com/features/schema/pieces/image)
- [Image / Video Markup](/guide/guides/media-markup.html)

## Required properties

- **url** `string`

  The URL of the image file (e.g., /images/cat.jpg).


## Defaults

- **@type**: `ImageObject`
- **@id**: `${canonicalUrl}#/schema/image/${hash(image.url)}`
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
export interface ImageObject extends Thing {
  /**
   * The fully-qualified, absolute URL of the image file (e.g., https://www.example.com/images/cat.jpg).
   */
  url: string
  /**
   * The fully-qualified, absolute URL of the image file (e.g., https://www.example.com/images/cat.jpg).
   * Note: The contentUrl and url properties are intentionally duplicated.
   */
  contentUrl?: string
  /**
   * A text string describing the image.
   * - Fall back to the image alt attribute if no specific caption field exists or is defined.
   */
  caption?: string
  /**
   * The height of the image in pixels.
   * - Must be used with width.
   */
  height?: number
  /**
   * The width of the image in pixels.
   * - Must be used with height.
   */
  width?: number
  /**
   * The language code for the textual content; e.g., en-GB.
   * - Only needed when providing a caption.
   */
  inLanguage?: string
}
```
