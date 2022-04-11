import { useSchemaOrgMeta } from '../useSchemaOrgMeta'
import {ref} from "vue-demi";
import { joinURL } from 'ufo'

/**
 * Async script tag loading.
 *
 * @see https://vueuse.org/useScriptTag
 */
export function _useRoute() {
  const schemaOrgMeta = useSchemaOrgMeta()

  if (!schemaOrgMeta.value.routeResolver) {
    return false
  }

  return schemaOrgMeta.value.routeResolver()
}

/**
 * Async script tag loading.
 *
 * @see https://vueuse.org/useScriptTag
 */
export function _useCanonicalUrl() {
  const url = ref<string|false>(false)
  const meta = useSchemaOrgMeta()
  const route = _useRoute()
  if (meta.value && route) {
    url.value = joinURL(meta.value.host, route.path)
  }
  return url
}

export function mergeRouteMeta(defaults: any) {
  const route = _useRoute()

  if (!route.value) {
    return
  }

  const meta = route.value.meta()

  if (meta.title)
    defaults.name = meta.title

  if (meta.description)
    defaults.description = meta.description

  if (meta.image)
    defaults.image = meta.image
}

export function mergeUrl(data: { url?: string  }) {
  const url = _useCanonicalUrl()
  if (url.value) {
    data.url = url.value
  }
}

export function mergeId(data: { ['@id']?: string; }, id: string) {
  const url = _useCanonicalUrl()
  if (url.value) {
    data['@id'] = `${url.value}#${id}`
  }
}
