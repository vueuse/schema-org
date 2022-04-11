import type { BreadcrumbList, ListItem } from 'schema-dts'
import { useSchemaOrgTag } from '../useSchemaOrgTag'
import {defu} from "defu";
import {OmitType} from "../types";
import {mergeId} from "../_meta";

type PartialListItem = OmitType<ListItem>

export function defineListItem(item: PartialListItem) {
  return defu(item, {
    '@type': 'ListItem',
  })
}

export function defineBreadcrumbs(items: PartialListItem[]) {
  const defaults: BreadcrumbList = {
    '@type': 'BreadcrumbList',
    'itemListElement': items.map(item => defineListItem(item)),
  }
  mergeId(defaults, 'breadcrumb')
  return defaults
}

/**
 * Async script tag loading.
 *
 * @see https://vueuse.org/useScriptTag
 */
export function useSchemaOrgBreadcrumb(listItems: PartialListItem[]) {
  return useSchemaOrgTag(defineBreadcrumbs(listItems))
}

export type UseSchemaOrgBreadcrumb = ReturnType<typeof useSchemaOrgBreadcrumb>
