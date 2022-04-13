import type { Ref } from 'vue-demi'
import { getCurrentInstance, onMounted, onUnmounted, ref, unref, watch } from 'vue-demi'
import { defu } from 'defu'
import { hash } from 'ohash'

interface UseJsonLdTagOptions {
  jsonSpacing?: number
  attributes?: Record<string, string>
}

/**
 * Script tag as application/ld+json with embedded src.
 */
export function useJsonLdTag(src: Record<any, any>, options?: UseJsonLdTagOptions) {

  const resolvedOptions = defu(options || {}, { jsonSpacing: 2 })

  const _hash = ref('')

  const document = typeof window !== 'undefined' ? window.document : undefined

  const scriptTag = ref<HTMLScriptElement | null>(null)

  /**
   * Load the script specified via `src`.
   *
   * @returns Promise<HTMLScriptElement>
   */
  const load = (): (HTMLScriptElement | boolean) => {
    // Check if document actually exists, otherwise resolve the Promise (SSR Support).
    if (!document)
      return false

    if (scriptTag.value)
      return scriptTag.value

    // Local variable defining if the <script> tag should be appended or not.
    let _el: HTMLScriptElement = document.createElement('script')
    _el.setAttribute('type', 'application/ld+json')
    if (options?.attributes) {
      for (const k in options.attributes) {
        _el.setAttribute(k, options.attributes[k])
      }
    }

    // Append the <script> tag to head.
    _el = document.head.appendChild(_el)

    scriptTag.value = _el
    return _el
  }

  /**
   * Unload the script specified by `src`.
   */
  const unload = () => {
    if (!document || !scriptTag.value)
      return

    if (scriptTag.value)
      scriptTag.value = null

    const el = document.querySelector<HTMLScriptElement>(`script[data-hash="${_hash.value}"]`)
    if (el)
      document.head.removeChild(el)
  }

  const json = () => {
    const el = document?.querySelector<HTMLScriptElement>(`script[data-hash="${_hash.value}"]`)
    if (el && typeof el.textContent === 'string')
      return JSON.parse(el.textContent)

    return null
  }

  const setTextContent = (textContent: string|Record<any, any>) => {
    if (typeof textContent !== 'string')
      textContent = JSON.stringify(textContent, undefined, resolvedOptions.jsonSpacing)

    _hash.value = hash(textContent)
    scriptTag.value!.textContent = textContent
    scriptTag.value!.setAttribute('data-hash', _hash.value)

    return textContent
  }

  // merge in existing with new
  const merge = (src: Ref<Record<any, any>>) => {
    src = unref(src)
    // need to wait for the scriptTag to be available
    if (!scriptTag.value) {
      watch(scriptTag, () => {
        if (scriptTag.value)
          setTextContent(defu(src, JSON.parse(scriptTag.value?.textContent || '{}')))
      })
    }
    else {
      setTextContent(defu(src, JSON.parse(scriptTag.value?.textContent || '{}')))
    }
  }

  const setup = () => {
    load()
    merge(src)
  }

  if (getCurrentInstance()) {
    onUnmounted(unload)
    onMounted(setup)
  }
  else {
    setup()
  }

  return { scriptTag, unload, json, merge }
}

export type UseJsonLdTagReturn = ReturnType<typeof useJsonLdTag>
