import type { Ref } from 'vue'
import {
  ref,
} from 'vue'
import { useMeta } from '#meta'

type MaybeRef<T> = T | Ref<T>

interface UseTitleOptions {
  ogTitle?: string
}

export const useMetaRobots = (newVal: MaybeRef<string | null | undefined> = null, options: UseTitleOptions = {}) => {
  const document = process.client ? window.document : undefined
  const val = ref(newVal ?? '' ?? null)
  useMeta({
    meta: [
      {
        name: 'robots',
        content: val,
      },
    ],
  })
  return val
}
