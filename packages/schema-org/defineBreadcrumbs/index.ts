import { joinURL } from 'ufo'
import { defu } from 'defu'
import type { OptionalMeta, Thing } from '../types'
import { useSchemaOrg } from '../useSchemaOrg'

export interface ListItem extends Thing {
  '@type': 'ListItem'
  /**
   *  The name of the page in question, as it appears in the breadcrumb navigation.
   */
  name: string
  /**
   * The unmodified canonical URL of the page in question.
   * - If a relative path is provided, it will be resolved to absolute.
   */
  item: string
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

export const resolveBreadcrumbId = (path?: string) => {
  const { resolvePathId } = useSchemaOrg()
  return resolvePathId('breadcrumb', path)
}

export function defineListItem(item: BreadcrumbItem): ListItem {
  const { canonicalHost } = useSchemaOrg()

  // fix relative links
  if (item.item && item.item?.includes('://'))
    item.item = joinURL(canonicalHost, item.item)

  return defu(item, {
    '@type': 'ListItem',
  }) as ListItem
}

export function defineBreadcrumbs(breadcrumb: OptionalMeta<BreadcrumbList>) {
  const defaults: Partial<BreadcrumbList> = {
    '@type': 'BreadcrumbList',
    '@id': resolveBreadcrumbId(),
  }
  defaults.itemListElement = breadcrumb.itemListElement.map((item, index) => {
    const listItem = defineListItem(item)
    listItem.position = index + 1
    return listItem
  })
  return defaults as BreadcrumbList
}
