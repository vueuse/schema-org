import { getCurrentInstance, onMounted, onUnmounted, ref, unref } from 'vue-demi'
import {defu} from "defu";

interface UseJsonLdTagOptions {
  jsonSpacing: number
}

/**
 * Script tag as application/ld+json with embedded src.
 */
export function useJsonLdTag(src: string, options?: UseJsonLdTagOptions) {
  options = defu(options, { jsonSpacing: 2 })
  src = JSON.stringify(unref(src), undefined, options.jsonSpacing)

  const document = typeof window !== 'undefined' ? window.document : undefined

  const scriptTag =  ref<HTMLScriptElement | null>(null)

  /**
   * Load the script specified via `src`.
   *
   * @returns Promise<HTMLScriptElement>
   */
  const load = (): (HTMLScriptElement | boolean) => {
    // Check if document actually exists, otherwise resolve the Promise (SSR Support).
    if (!document) {
      return false
    }

    if (scriptTag.value) {
      return scriptTag.value
    }

    // check for duplicates
    if (Array
      .from(document.head.querySelectorAll('script[type="application/ld+json"]'))
      .find(tag => tag.textContent === src)
    ) {
      console.warn('[@vueuse/schema-org] Duplicate ld+json script detected, ignoring latest.', src)
      return
    }

    // Local variable defining if the <script> tag should be appended or not.
    let _el: HTMLScriptElement = document.createElement('script')
    _el.setAttribute('type', 'application/ld+json')
    _el.textContent = src

    // Append the <script> tag to head.
    _el = document.head.appendChild(_el)

    scriptTag.value = _el
    return _el
  }

  /**
   * Unload the script specified by `src`.
   */
  const unload = () => {
    if (!document)
      return


    document.head.removeChild(scriptTag.value)
  }

  if (getCurrentInstance()) {
    onUnmounted(unload)
    onMounted(load)
  }
  else {
    load()
  }

  return scriptTag
}
