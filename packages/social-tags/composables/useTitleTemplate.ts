import type { Ref } from 'vue'
import {
  ref,
  unref,
} from 'vue'

type MaybeRef<T> = T | Ref<T>

const titleTemplate = ref('%s | %s')

export const useTitleTemplate = (newTitleTemplate: MaybeRef<string | null | undefined> = null) => {
  if (newTitleTemplate)
    titleTemplate.value = unref(newTitleTemplate)

  return titleTemplate
}
