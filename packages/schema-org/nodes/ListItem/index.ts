import type { DeepPartial } from 'utility-types'
import type { Arrayable, IdReference, SchemaNodeInput, SchemaOrgContext, Thing } from '../../types'
import {
  defineSchemaResolver,
  resolveArrayable, resolveSchemaResolver, resolveUrl, setIfEmpty,
} from '../../utils'
import { defineSchemaOrgComponent } from '../../components/defineSchemaOrgComponent'

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
 * Describes an Article on a WebPage.
 */
export const defineListItemPartial = <K>(input?: DeepPartial<ListItem> & K) =>
  // hacky way for users to get around strict typing when using custom schema, route meta or augmentation
  defineListItem(input as ListItem)

export function defineListItem<T extends SchemaNodeInput<ListItem>>(input: T) {
  return defineSchemaResolver<T, ListItem>(input, {
    defaults() {
      return {
        '@type': 'ListItem',
      }
    },
  })
}

export function resolveListItems(ctx: SchemaOrgContext, input: Arrayable<ListItemInput>) {
  let index = 1
  return resolveArrayable<ListItemInput, ListItem>(input, (input) => {
    if (typeof input === 'string') {
      input = {
        name: input,
      }
    }
    const listItem = resolveSchemaResolver(ctx, defineListItem(input))
    setIfEmpty(listItem, 'position', index++)
    resolveUrl(listItem, 'item', ctx.canonicalHost)
    return listItem
  }, { array: true })
}

export const SchemaOrgListItem = defineSchemaOrgComponent('SchemaOrgListItem', defineListItem)
