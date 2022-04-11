import type { WebPage } from 'schema-dts'
import { defu } from 'defu'
import { useSchemaOrgTag } from '../useSchemaOrgTag'
import { defineWebSite } from '../useSchemaOrgWebSite'
import {OmitType} from "../types";
import {mergeId, mergeRouteMeta, mergeUrl} from "../_meta";

type PartialWebPage = OmitType<WebPage>

export function defineWebPage(webPage: PartialWebPage) {
  const defaults: WebPage = {
    '@type': 'WebPage',
  }

  mergeId(defaults)
  mergeUrl(defaults)
  mergeRouteMeta(defaults)

  defaults.isPartOf = defineWebSite()
  return defu<PartialWebPage, WebPage>(webPage, defaults)
}

/**
 * Async script tag loading.
 *
 * @see https://vueuse.org/useScriptTag
 */
export function useSchemaOrgWebPage(
  options?: WebPage,
) {
  return useSchemaOrgTag(defineWebPage(options))
}

export type UseSchemaOrgWebPage = ReturnType<typeof useSchemaOrgWebPage>
