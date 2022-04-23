import { joinURL } from 'ufo'
import { defu } from 'defu'
import type { OptionalMeta, Thing } from '../types'
import { useSchemaOrg } from '../useSchemaOrg'
import { defineNodeResolver, idReference, prefixId, setIfEmpty } from '../utils'
import type { WebPage } from '../defineWebPage'
import { WebPageId } from '../defineWebPage'

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
export type BreadcrumbItem = OptionalMeta<ListItem>

export interface BreadcrumbList extends Thing {
  '@type': 'BreadcrumbList'
  /**
   *  An array of ListItem objects, representing the position of the current page in the site hierarchy.
   */
  itemListElement: BreadcrumbItem[]
}

export function defineListItem(item: ListItem): ListItem {
  const { canonicalHost } = useSchemaOrg()

  // fix relative links
  if (item.item && item.item?.includes('://'))
    item.item = joinURL(canonicalHost, item.item)

  return defu(item, {
    '@type': 'ListItem',
  }) as ListItem
}

export const BreadcrumbId = '#breadcrumb'

export function defineBreadcrumb(breadcrumb: OptionalMeta<BreadcrumbList>) {
  return defineNodeResolver<BreadcrumbList>(breadcrumb, {
    defaults({ canonicalUrl }) {
      return {
        '@type': 'BreadcrumbList',
        '@id': prefixId(canonicalUrl, BreadcrumbId),
      }
    },
    resolve(breadcrumb) {
      breadcrumb.itemListElement = breadcrumb.itemListElement
        .map((item, index) => {
          const listItem = defineListItem(item as ListItem)
          listItem.position = index + 1
          return listItem
        })
      // The final/current 'crumb' should omit the item property.
      delete breadcrumb.itemListElement[breadcrumb.itemListElement.length - 1].item
      return breadcrumb
    },
    mergeRelations(breadcrumb, { findNode }) {
      // merge breadcrumbs reference into the webpage
      const webPage = findNode<WebPage>(WebPageId)
      if (webPage)
        setIfEmpty(webPage, 'breadcrumb', idReference(breadcrumb))
    },
  })
}
