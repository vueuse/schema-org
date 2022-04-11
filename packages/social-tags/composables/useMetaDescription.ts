import type { Ref } from 'vue'
import {
  ref,
} from 'vue'
import { useMeta } from '#meta'

type MaybeRef<T> = T | Ref<T>

interface UseMetaDescriptionOptions {
  ogDescription?: string
}

export const useMetaDescription = (newDescription: MaybeRef<string | null | undefined> = null, options: UseMetaDescriptionOptions = {}) => {
  const document = process.client ? window.document : undefined
  const description = ref(newDescription ?? document?.querySelector('meta[name="description"]')?.content ?? null)
  useMeta({
    meta: [
      {
        name: 'description',
        content: description,
      },
      {
        property: 'og:description',
        content: options.ogDescription ?? description,
      },
    ],
  })
  return description
}
