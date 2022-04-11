import type { WebSite } from 'schema-dts'
import { defu } from 'defu'
import { useSchemaOrgTag } from '../useSchemaOrgTag'
import { useSchemaOrgMeta } from '../useSchemaOrgMeta'
import type { OmitType } from '../types'
import {useSchemaOrgPublisher} from "../useSchemaOrgPublisher";

type PartialWebSite = OmitType<WebSite>

export function defineWebSite(website: PartialWebSite = {}) {
  let defaults: WebSite = {
    '@type': 'WebSite',
  }

  const meta = useSchemaOrgMeta()
  if (meta.value?.host) {
    meta['@id'] = `${meta.value.host}#website`
  }
  if (meta.value?.website) {
    defaults = defu(defaults, meta.value.website)
  }
  const publisher = useSchemaOrgPublisher()
  if (publisher) {
    defaults.publisher = publisher
  }

  return defu<PartialWebSite, WebSite>(website, defaults)
}

/**
 * Async script tag loading.
 *
 * @see https://vueuse.org/useScriptTag
 */
export function useSchemaOrgWebSite(
  options: PartialWebSite = {},
) {
  return useSchemaOrgTag(defineWebSite(options))
}

export type UseWebSiteSchema = ReturnType<typeof useSchemaOrgWebSite>
