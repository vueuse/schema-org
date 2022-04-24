# Vue Schema.org Breadcrumb

**Type**: `defineBreadcrumb(breadcrumb: Breadcrumb)`

Describes an `Breadcrumb` on a `WebPage`.

## Useful Links

- [BreadcrumbList - Schema.org ](https://schema.org/BreadcrumbList)
- [Breadcrumb Schema Markup - Google Search Central](https://developers.google.com/search/docs/advanced/structured-data/breadcrumb)
- [Breadcrumb - Yoast](https://developer.yoast.com/features/schema/pieces/breadcrumb)
- [Recipe: Breadcrumbs](/guide/recipes/breadcrumbs)

## Required Configuration

- **itemListElement**  An array of ListItem objects, representing the position of the current page in the site hierarchy.

### Minimal Example

```ts
useSchemaOrg([
  defineBreadcrumb({
    itemListElement: [
      { name: 'Home', item: '/' },
      { name: 'Blog', item: '/blog' },
      { name: 'My Article' },
    ],
  })
])
```

## Component

A headless component is also provided named `SchemaOrgBreadcrumb`. This will inject
the Schema breacrumb for you based on the provided `items`.

### Props

- `item` - Matches `itemListElement`

### Slots

- `item` - Provides scoped slot data of the ListItem object

```vue
<template>
  <SchemaOrgBreadcrumb :items="breadcrumb" />
  <template #item="{ item, name }">
    <a v-if="item" :href="item">{{ name }}</a>
    <span v-else>{{ name }}</span>
  </template>
  </SchemaOrgBreadcrumb>
</template>
```

## Defaults

- **@type**: `BreadcrumbList`
- **@id**: `${canonicalUrl}#breadcrumb`

## Relation Transforms

[WebPage](/schema/webpage)

- sets default `breadcrumb` to this node

## Resolves

- `itemListElement.position` is computed for each list element


## Type Definition

```ts
/**
 * A BreadcrumbList is an ItemList consisting of a chain of linked Web pages,
 * typically described using at least their URL and their name, and typically ending with the current page.
 */
export interface BreadcrumbList extends Thing {
  '@type': 'BreadcrumbList'
  /**
   *  An array of ListItem objects, representing the position of the current page in the site hierarchy.
   */
  itemListElement: BreadcrumbItem[]
  /**
   * Type of ordering (e.g. Ascending, Descending, Unordered).
   *
   * @default undefined
   */
  itemListOrder?: 'Ascending'|'Descending'|'Unordered'
  /**
   * The number of items in an ItemList.
   * Note that some descriptions might not fully describe all items in a list (e.g., multi-page pagination);
   * in such cases, the numberOfItems would be for the entire list.
   *
   * @default undefined
   */
  numberOfItems?: number
}

/**
 * An list item, e.g. a step in a checklist or how-to description.
 */
export interface ListItem extends Thing {
  '@type': 'ListItem'
  /**
   *  The name of the page in question, as it appears in the breadcrumb navigation.
   */
  name: string
  /**
   * The unmodified canonical URL of the page in question.
   * - If a relative path is provided, it will be resolved to absolute.
   * - Item is not required for the last entry
   */
  item?: string
  /**
   *  An integer (starting at 1), counting the 'depth' of the page from (including) the homepage.
   */
  position?: number
}
```
