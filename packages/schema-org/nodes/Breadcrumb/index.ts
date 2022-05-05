import type { DeepPartial } from 'utility-types'
import type { SchemaNodeInput, Thing } from '../../types'
import {
  defineSchemaResolver,
  idReference,
  prefixId,
  resolveId,
  setIfEmpty,
} from '../../utils'
import type { WebPage } from '../WebPage'
import { PrimaryWebPageId } from '../WebPage'
import type { ListItem, ListItemInput } from '../ListItem'
import { resolveListItems } from '../ListItem'
import { defineSchemaOrgComponent } from '../../components/defineSchemaOrgComponent'

/**
 * A BreadcrumbList is an ItemList consisting of a chain of linked Web pages,
 * typically described using at least their URL and their name, and typically ending with the current page.
 */
export interface Breadcrumb extends Thing {
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
  itemListOrder?: 'Ascending' | 'Descending' | 'Unordered'
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
 * Describes the hierarchical position of a WebPage on a WebSite.
 */
export const defineBreadcrumbPartial = <K>(input?: DeepPartial<Breadcrumb> & K) =>
  // hacky way for users to get around strict typing when using custom schema, route meta or augmentation
  defineBreadcrumb(input as Breadcrumb)

/**
 * Describes the hierarchical position a WebPage within a WebSite.
 */
export function defineBreadcrumb<T extends SchemaNodeInput<Breadcrumb>>(input: T) {
  return defineSchemaResolver<T, Breadcrumb>(input, {
    required: ['itemListElement'],
    defaults({ canonicalUrl }) {
      return {
        '@type': 'BreadcrumbList',
        '@id': prefixId(canonicalUrl, PrimaryBreadcrumbId),
      }
    },
    resolve(breadcrumb, client) {
      resolveId(breadcrumb, client.canonicalUrl)
      if (breadcrumb.itemListElement)
        breadcrumb.itemListElement = resolveListItems(client, breadcrumb.itemListElement) as ListItemInput[]
      return breadcrumb
    },
    rootNodeResolve(breadcrumb, { findNode }) {
      // merge breadcrumbs reference into the webpage
      const webPage = findNode<WebPage>(PrimaryWebPageId)
      if (webPage)
        setIfEmpty(webPage, 'breadcrumb', idReference(breadcrumb))
    },
  })
}

export const SchemaOrgBreadcrumb = defineSchemaOrgComponent('SchemaOrgBreadcrumb', defineBreadcrumb)
