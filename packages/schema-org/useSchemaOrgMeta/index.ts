import type { Ref } from 'vue-demi'
import { ref } from 'vue-demi'
import { defu } from 'defu'
import type { WebSite, SchemaValue } from 'schema-dts'
import {Publisher} from "../types";

interface SchemaOrgMeta {
  routeResolver?: Ref<{ url: string }>
  host?: string
  website?: WebSite
  publisher?: Publisher
}

const schemaOrgMeta = ref<SchemaOrgMeta>({})

/**
 * Async script tag loading.
 *
 * @see https://vueuse.org/useScriptTag
 */
export function useSchemaOrgMeta(
  value?: SchemaOrgMeta,
): Ref<SiteMeta> {
  if (value)
    schemaOrgMeta.value = defu(value, schemaOrgMeta.value)
  return schemaOrgMeta
}

export type UseSchemaOrgMeta = ReturnType<typeof useSchemaOrgMeta>
