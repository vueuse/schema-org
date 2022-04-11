import type { Ref } from 'vue'
import {
  ref,
} from 'vue'
import { useMetaRobots } from './useRobots'
import { useMeta } from '#meta'

type MaybeRef<T> = T | Ref<T>

interface UseTitleOptions {
  ogTitle?: string
}

export const useMetaNoIndex = (indexable: MaybeRef<boolean | null | undefined> = null) => {
  if (typeof indexable === 'boolean')
    return useMetaRobots(indexable ? 'index, follow' : 'noindex, nofollow')

  return ref(useMetaRobots().value.contains('noindex'))
}
