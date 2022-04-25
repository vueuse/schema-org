import { defu } from 'defu'
import type { SchemaNodeInput, Thing } from '../types'
import { useSchemaOrg } from '../useSchemaOrg'
import type { NodeResolver } from '../utils'
import { defineNodeResolver, ensureBase, idReference, prefixId, setIfEmpty } from '../utils'
import type { WebPage } from '../defineWebPage'
import { PrimaryWebPageId } from '../defineWebPage'

/**
 * A BreadcrumbList is an ItemList consisting of a chain of linked Web pages,
 * typically described using at least their URL and their name, and typically ending with the current page.
 */
export interface BreadcrumbList extends Thing {
  '@type': 'BreadcrumbList'
  /**
   *  An array of ListItem objects, representing the position of the current page in the site hierarchy.
   */
  itemListElement: SchemaNodeInput<BreadcrumbItem>[]
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

export type BreadcrumbItem = ListItem

export function defineListItem(item: ListItem): ListItem {
  const { canonicalHost } = useSchemaOrg()

  // fix relative links
  if (item.item)
    item.item = ensureBase(canonicalHost, item.item)

  return defu(item, {
    '@type': 'ListItem',
  }) as ListItem
}

export const PrimaryBreadcrumbId = '#breadcrumb'

export type BreadcrumbOptionalKeys = '@id'|'@type'
export type BreadcrumbNodeResolver<T extends keyof BreadcrumbList = BreadcrumbOptionalKeys> = NodeResolver<BreadcrumbList, T>

/**
 * Describes the hierarchical position a WebPage within a WebSite.
 * @param breadcrumb
 */
export function defineBreadcrumb(breadcrumb: SchemaNodeInput<BreadcrumbList>): BreadcrumbNodeResolver {
  return defineNodeResolver<BreadcrumbList>(breadcrumb, {
    defaults({ canonicalUrl }) {
      return {
        '@type': 'BreadcrumbList',
        '@id': prefixId(canonicalUrl, PrimaryBreadcrumbId),
      }
    },
    resolve(breadcrumb) {
      breadcrumb.itemListElement = breadcrumb.itemListElement
        .map((item, index) => {
          const listItem = defineListItem(item as ListItem)
          setIfEmpty(listItem, 'position', index + 1)
          return listItem
        })
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
