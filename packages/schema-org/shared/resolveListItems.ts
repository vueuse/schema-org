import { defu } from 'defu'
import type { IdReference, SchemaNodeInput, Thing } from '../types'
import { resolveUrl, resolver } from '../utils'

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

export type ListItemInput = SchemaNodeInput<ListItem> | IdReference | string

/**
 * An list item, e.g. a step in a checklist or how-to description.
 */
export function resolveListItems(input: ListItemInput[]) {
  let index = 0
  return resolver<ListItemInput, ListItem>(input, (input, { canonicalHost }) => {
    if (typeof input === 'string') {
      input = {
        name: input,
      }
    }
    const listItem = defu(input as unknown as ListItem, {
      '@type': 'ListItem',
      'position': index + 1,
    }) as ListItem
    index++
    resolveUrl(listItem, 'item', canonicalHost)
    return listItem
  }, { array: true })
}
