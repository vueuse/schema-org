import type { DeepPartial } from 'utility-types'
import type { SchemaNodeInput, Thing } from '../types'
import { defineNodeResolver, idReference, prefixId, resolveId, setIfEmpty } from '../utils'
import type { WebPage } from '../defineWebPage'
import { PrimaryWebPageId } from '../defineWebPage'
import type { ListItem, ListItemInput } from '../shared/resolveListItems'
import { resolveListItems } from '../shared/resolveListItems'

/**
 * A BreadcrumbList is an ItemList consisting of a chain of linked Web pages,
 * typically described using at least their URL and their name, and typically ending with the current page.
 */
export interface BreadcrumbList extends Thing {
  '@type': 'BreadcrumbList'
  /**
   * Resolved breadcrumb list
   */
  itemListElement: ListItemInput[]
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

export type BreadcrumbItem = ListItem

export const PrimaryBreadcrumbId = '#breadcrumb'

/**
 * Describes the hierarchical position a WebPage within a WebSite.
 */
export function defineBreadcrumbPartial<K>(input: DeepPartial<BreadcrumbList> & K) {
  // hacky way for users to get around strict typing when using custom schema, route meta or augmentation
  return defineBreadcrumb(input as SchemaNodeInput<BreadcrumbList>)
}

/**
 * Describes the hierarchical position a WebPage within a WebSite.
 */
export function defineBreadcrumb<T extends SchemaNodeInput<BreadcrumbList>>(input: T) {
  return defineNodeResolver<T, BreadcrumbList>(input, {
    required: ['itemListElement'],
    defaults({ canonicalUrl }) {
      return {
        '@type': 'BreadcrumbList',
        '@id': prefixId(canonicalUrl, PrimaryBreadcrumbId),
      }
    },
    resolve(breadcrumb, { canonicalUrl }) {
      resolveId(breadcrumb, canonicalUrl)
      if (breadcrumb.itemListElement)
        breadcrumb.itemListElement = resolveListItems(breadcrumb.itemListElement) as ListItemInput[]
      return breadcrumb
    },
    mergeRelations(breadcrumb, { findNode }) {
      // merge breadcrumbs reference into the webpage
      const webPage = findNode<WebPage>(PrimaryWebPageId)
      if (webPage)
        setIfEmpty(webPage, 'breadcrumb', idReference(breadcrumb))
    },
  })
}
