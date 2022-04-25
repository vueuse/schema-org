# Vue Schema.org Product

**Type**: `defineProduct(product: Product)`

Describes an `Product` on a `WebPage`.

## Useful Links

- [Product - Schema.org](https://schema.org/Product)
- [Product Schema Markup - Google Search Central](https://developers.google.com/search/docs/advanced/structured-data/product)
- [Product - Yoast](https://developer.yoast.com/features/schema/pieces/product)
- [Recipe: eCommerce](/guide/recipes/e-commerce)

## Required Config

- **name** Provided via route meta key `title` or `name` manually
- Either review or aggregateRating or offers, see [functions](#functions)

## Recommended Config

- **image** Link a primary image or a collection of images to used to the product. This can be provided
  using route meta on the `image` key, see [defaults](#defaults).


### Minimal Example

```ts
useSchemaOrg([
  defineProduct({
    name: 'Guide To Vue.js',
    offers: [
      { price: 50 },
    ],
    aggregateRating: {
      ratingValue: 88,
      bestRating: 100,
      ratingCount: 20,
    },
  })
])
```


## Defaults

- **@type**: `Product`
- **@id**: `${canonicalUrl}#product`
- **name**: `currentRouteMeta.title` _(see: [route meta resolving](/guide/how-it-works.html#route-meta-resolving))_
- **image**: `currentRouteMeta.image` _(see: [route meta resolving](/guide/how-it-works.html#route-meta-resolving))_
- **description**: `currentRouteMeta.description` _(see: [route meta resolving](/guide/how-it-works.html#route-meta-resolving))_
- **brand**: id reference of the identity 
- **mainEntityOfPage** id reference of the web page


## Resolves

- `image`'s are resolved to absolute

## Type Definition

```ts
/**
 * Any offered product or service.
 * For example: a pair of shoes; a concert ticket; the rental of a car;
 * a haircut; or an episode of a TV show streamed online.
 */
export interface Product extends Thing {
  /**
   * The name of the product.
   */
  name: string
  /**
   * A reference-by-ID to one or more imageObject s which represent the product.
   * - Must be at least 696 pixels wide.
   * - Must be of the following formats+file extensions: .jpg, .png, .gif ,or .webp.
   */
  image?: Arrayable<string|ImageObject|IdReference>
  /**
   *  An array of references-by-ID to one or more Offer or aggregateOffer pieces.
   */
  offers?: Arrayable<Offer|IdReference>
  /**
   *  A reference to an Organization piece, representing brand associated with the Product.
   */
  brand?: Organization|IdReference
  /**
   * A reference to an Organization piece which represents the WebSite.
   */
  seller?: Organization|IdReference
  /**
   * A text description of the product.
   */
  description?: string
  /**
   * An array of references-by-id to one or more Review pieces.
   */
  review?: string
  /**
   * A merchant-specific identifier for the Product.
   */
  sku?: string
  /**
   * An AggregateRating object.
   */
  aggregateRating?: IdReference|AggregateRating
  /**
   * An AggregateOffer object.
   */
  aggregateOffer?: IdReference|AggregateOffer
  /**
   * A reference to an Organization piece, representing the brand which produces the Product.
   */
  manufacturer?: Organization|IdReference
}
```
