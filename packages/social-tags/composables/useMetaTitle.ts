import type { Ref } from 'vue'
import {
  ref,
} from 'vue'
import { useTitleTemplate } from './useTitleTemplate'
import { useMeta } from '#meta'

type MaybeRef<T> = T | Ref<T>

interface UseTitleOptions {
  ogTitle?: string
}

export const useMetaTitle = (newTitle: MaybeRef<string | null | undefined> = null, options: UseTitleOptions = {}) => {
  const document = process.client ? window.document : undefined
  const title = ref(newTitle ?? document?.title ?? null)
  useMeta({
    title: `${title.value} | ${useTitleTemplate().value}`,
    meta: [
      {
        property: 'og:title',
        content: options?.ogTitle ?? `${title.value} | ${useTitleTemplate().value}`,
      },
    ],
  })
  return title
}
