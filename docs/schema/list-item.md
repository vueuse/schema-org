# Vue Schema.org ListItem

- **Type**: `resolveListItems(input: ListItemInput[])`

  An list item, e.g. a step in a checklist or how-to description.

## Useful Links

- [ListItem - Schema.org](https://schema.org/ListItem)

## Required properties

- **name** `string`

  The name of the list item.


## Defaults

- **@type**: `ListItem`

## Resolves

- `url` will be resolved to the canonical URL of the list item.

## Example

### Minimal

```ts
// ListItemInput example
[
  { name: 'Step 1.' },
  { name: 'Step 2.' },
]
```

## Type Definition

```ts
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
